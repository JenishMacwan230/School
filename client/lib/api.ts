const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://school-cntx.onrender.com";
  
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();

  // 👇 SAFETY LOG (remove later)
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
