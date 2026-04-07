const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${baseURL}${path}`;
  const res = await fetch(url, options);

  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.detail) message = body.detail;
      else if (body?.message) message = body.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
