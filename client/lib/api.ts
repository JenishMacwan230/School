const SERVER_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

const API_BASE_URL = SERVER_API_BASE_URL;

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const requestUrl = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  let res: Response;

  try {
    res = await fetch(requestUrl, {
      ...options,
      credentials: "include", // ✅ MOST IMPORTANT LINE
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new Error(
      `Network error while calling ${requestUrl}. Ensure backend is running and NEXT_PUBLIC_API_URL is correct.`
    );
  }

  const text = await res.text();

  console.log("API RESPONSE:", requestUrl, text);

  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      const preview = text.slice(0, 120).replace(/\s+/g, " ");
      throw new Error(`Invalid JSON from ${requestUrl}. Response preview: ${preview}`);
    }
  }

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data as T;
}
