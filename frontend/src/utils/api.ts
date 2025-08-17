const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Generic GET request
export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`GET ${endpoint} failed: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// Generic POST request
export async function apiPost<TResponse, TBody = unknown>(
  endpoint: string,
  body: TBody
): Promise<TResponse> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST ${endpoint} failed: ${res.statusText}`);
  }

  return res.json() as Promise<TResponse>;
}

