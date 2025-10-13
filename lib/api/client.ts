// 맨 위에 추가/수정
import { getToken, setToken, clearToken } from "@/lib/auth/token";

// 베이스 URL 및 네트워크 설정 (환경변수 기반)
const BASE = process.env.NEXT_PUBLIC_API_BASE;
const DEFAULT_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 10000);
const DEFAULT_RETRY = Math.max(0, Number(process.env.NEXT_PUBLIC_API_RETRY || 2));

let isRefreshing = false;
let waitQueue: Array<() => void> = [];

function enqueue(cb: () => void) { waitQueue.push(cb); }
function flushQueue() { waitQueue.forEach((fn) => fn()); waitQueue = []; }

async function refreshOnce() {
  if (isRefreshing) {
    await new Promise<void>((resolve) => enqueue(resolve));
    return;
  }
  isRefreshing = true;
  try {
    const res = await fetch(`${BASE}/api/v1/login/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("refresh failed");
    const data = (await res.json()) as { accessToken?: string };
    if (data?.accessToken) setToken(data.accessToken);
  } finally {
    isRefreshing = false;
    flushQueue();
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) {
    throw new Error(
      "API base URL is not configured. Set NEXT_PUBLIC_API_BASE in your .env.local"
    );
  }

  const fetchWithTimeout = async (input: RequestInfo | URL, init?: RequestInit & { timeoutMs?: number }) => {
    const controller = new AbortController();
    const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(id);
    }
  };

  const doFetch = async (): Promise<Response> => {
    const token = getToken() || process.env.NEXT_PUBLIC_API_TOKEN || "";
    return fetchWithTimeout(`${BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
      cache: "no-store",
      timeoutMs: DEFAULT_TIMEOUT_MS,
    });
  };

  // 네트워크 오류/5xx에 대해 제한적 재시도
  let attempt = 0;
  let res: Response | null = null;
  // 첫 시도 + 재시도 횟수
  const maxAttempts = 1 + DEFAULT_RETRY;
  while (attempt < maxAttempts) {
    try {
      res = await doFetch();
      // 5xx만 재시도 대상
      if (res.status >= 500 && res.status <= 599 && attempt < maxAttempts - 1) {
        const backoff = Math.min(2000, 300 * Math.pow(2, attempt));
        await new Promise((r) => setTimeout(r, backoff));
        attempt++;
        continue;
      }
      break;
    } catch (e) {
      // 네트워크/타임아웃 재시도
      if (attempt < maxAttempts - 1) {
        const backoff = Math.min(2000, 300 * Math.pow(2, attempt));
        await new Promise((r) => setTimeout(r, backoff));
        attempt++;
        continue;
      }
      throw e;
    }
  }
  if (!res) throw new Error("request failed before receiving response");


  if (res.status === 401) {
    try {
      await refreshOnce();
      res = await doFetch();
    } catch {
      clearToken();
      throw new Error(`[401] unauthorized & refresh failed: ${path}`);
    }
  }

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`[${res.status}] ${path}: ${msg || "request failed"}`);
  }
  return (await res.json()) as T;
}

export async function tryRequest<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    return await request<T>(path, init);
  } catch {
    return fallback;
  }
}
