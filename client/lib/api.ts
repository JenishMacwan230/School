const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://school-cntx.onrender.com";

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // 🔑 Get JWT token (stored after login)
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();

  // 👇 Debug log (safe to keep for now)
  console.log("API RESPONSE:", path, text);

  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON from ${path}`);
    }
  }

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data as T;
}
