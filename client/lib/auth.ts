import { apiFetch } from "./api";

export const login = (email: string, password: string) =>
  apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logout = () =>
  apiFetch("/api/auth/logout", {
    method: "POST",
  });

export const getMe = () =>
  apiFetch("/api/auth/me");
