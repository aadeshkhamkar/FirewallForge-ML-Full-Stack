// src/context/AuthContext.tsx
// Replace the file contents with this (TypeScript + React)

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";

/**
 * Use Vite env variable (must start with VITE_)
 * Add `.env` at project root with: VITE_API_URL=http://localhost:4000
 */
const API_BASE: string =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

const STORAGE_KEY = "learnhub_user";
const TOKEN_KEY = "learnhub_token";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, load from localStorage and optionally validate token
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (token) {
      // Verify token with /api/me (non-blocking)
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.ok && data.user) {
              setUser(data.user);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
            } else {
              // token invalid: clear
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem(TOKEN_KEY);
              setUser(null);
            }
          } else {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
          }
        } catch (e) {
          // network issues - leave stored user until next attempt
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password = ""): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.ok && data.user) {
        // normalize: some servers return user.name / user.full_name
        const normalizedUser = {
          id: data.user.id ?? data.user.user_id ?? data.user.email,
          name: data.user.name ?? data.user.full_name,
          full_name: data.user.full_name ?? data.user.name,
          email: data.user.email,
          role: data.user.role ?? "student",
          // preserve other fields if present
          ...data.user,
        };

        setUser(normalizedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));

        if (data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
        }

        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (err) {
      console.error("Login failed", err);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
