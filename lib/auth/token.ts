// 로컬스토리지에 JWT 보관/조회 유틸
const KEY = "ssb_token";

const isBrowser = () => typeof window !== "undefined";

export function getToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, token);
}

export function clearToken() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY);
}
