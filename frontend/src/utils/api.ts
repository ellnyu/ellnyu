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
export async function authFetch<TResponse>(
  endpoint: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Auth fetch ${endpoint} failed: ${res.statusText}`);
  }

  return res.json() as Promise<TResponse>;
}

// Authenticated GET request
export async function authGet<TResponse>(endpoint: string): Promise<TResponse> {
  return authFetch<TResponse>(endpoint, {
    method: "GET",
  });
}

// Authenticated POST request
export async function authPost<TResponse, TBody = unknown>(
  endpoint: string,
  body: TBody
): Promise<TResponse> {
  return authFetch<TResponse>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
// Authenticated PUT request
export async function authPut<TResponse, TBody = unknown>(
  endpoint: string,
  body: TBody
): Promise<TResponse> {
  return authFetch<TResponse>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// Authenticated DELETE request
export async function authDelete<TResponse>(
  endpoint: string,
  body: unknown,
  options: RequestInit = {}
): Promise<TResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Auth DELETE ${endpoint} failed: ${res.statusText}`);
  }

  return res.json() as Promise<TResponse>;
}
