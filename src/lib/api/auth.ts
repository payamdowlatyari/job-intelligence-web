import { getApiUrl } from "./apiFetch";

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Makes a POST request to the given API endpoint with the given body.
 *
 * If the response is not successful (2xx), an error is thrown with the response status and status text.
 * If the response is successful, the parsed JSON response is returned.
 * If the response contains a "detail" or "message" key, the error thrown is set to that value.
 *
 * @template T
 * @param {string} path - The path of the API endpoint to fetch from
 * @param {unknown} body - The body of the request
 * @returns {Promise<T>} A promise that resolves to the parsed JSON response
 */
async function authFetch<T>(path: string, body: unknown): Promise<T> {
  const url = getApiUrl(path);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.detail) message = data.detail;
      else if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

/**
 * Registers a new user with the provided email, password, and name.
 *
 * @param {RegisterRequest} data - The data to register the user with
 * @returns {Promise<AuthResponse>} A promise that resolves to the authentication response
 */
export function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  return authFetch<AuthResponse>("/auth/register", data);
}

/**
 * Logs in a user with the provided email and password.
 *
 * @param {LoginRequest} data - The data to log in the user with
 * @returns {Promise<AuthResponse>} A promise that resolves to the authentication response
 */
export function loginUser(data: LoginRequest): Promise<AuthResponse> {
  return authFetch<AuthResponse>("/auth/login", data);
}
