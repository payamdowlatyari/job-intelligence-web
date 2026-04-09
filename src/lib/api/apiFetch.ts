const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "http://localhost:8000";

/**
 * Returns a full URL for an API endpoint given a path.
 */
export function getApiUrl(path: string): string {
  if (!baseURL) {
    throw new Error("API base URL is not defined");
  }
  return `${baseURL}/api/v1${path}`;
}

/**
 * Fetches data from the API at the given path and returns the parsed JSON response.
 * If the response is not successful (2xx), an error is thrown with the response status and status text.
 * If the response is successful, the parsed JSON response is returned.
 * If the response contains a "detail" or "message" key, the error thrown is set to that value.
 * @param path - The path of the API endpoint to fetch from
 * @param options - Optional fetch options
 * @returns - A promise that resolves to the parsed JSON response
 * @throws - An error if the response is not successful
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  responseKey?: string | null,
): Promise<T> {
  const url = getApiUrl(path);

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

  const body = await res.json();

  if (responseKey === null) {
    return body as T;
  }

  if (responseKey) {
    return body[responseKey] as T;
  }

  return (body.jobs ?? body) as T;
}
