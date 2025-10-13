import { tryRequest } from "./client";
import { setToken, clearToken, getToken } from "@/lib/auth/token";

type LoginResponse = { status: number; accessToken: string; refreshToken?: string };
type RefreshResponse = { status: number; accessToken: string };

export async function loginWithGoogle(authCode: string) {
  const data = await tryRequest<LoginResponse>(
    "/api/v1/login/google",
    { status: 200, accessToken: "" },
    {
      method: "POST",
      body: JSON.stringify({ code: authCode, redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI }),
    }
  );
  if (data?.accessToken) setToken(data.accessToken);
  return data;
}

export async function refreshToken() {
  const data = await tryRequest<RefreshResponse>(
    "/api/v1/login/refresh",
    { status: 200, accessToken: "" },
    { method: "POST" }
  );
  if (data?.accessToken) setToken(data.accessToken);
  return data;
}

export async function logout() {
  await tryRequest("/api/v1/logout", {}, { method: "DELETE" });
  clearToken();
}
