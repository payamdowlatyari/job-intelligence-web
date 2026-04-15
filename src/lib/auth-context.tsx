"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const TOKEN_KEY = "job-intel-token";
const USER_KEY = "job-intel-user";

export interface AuthUser {
  email: string;
  name: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

/**
 * AuthProvider is a context provider that stores the authentication token and user in local storage.
 * It loads the stored token and user when mounted and sets them in state.
 * It provides a login function that saves the token and user in local storage and updates the state.
 * It provides a logout function that clears the token and user in local storage and updates the state.
 * It wraps the children in an AuthContext.Provider with the token, user, isAuthenticated, isLoading, login, and logout values.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth is a hook that provides the authentication token, user, and functions to login and logout.
 * It returns the authentication token, user, isAuthenticated, isLoading, login, and logout.
 * It throws an error if used outside of AuthContextProvider.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Returns the stored authentication token, or null if it is not available.
 * @returns {string | null}
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
