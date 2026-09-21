"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AuthData = {
  username: string;
  password: string;
  loggedIn: boolean;
};

const STORAGE_KEY = "qitars-auth-v1"; // بيانات الاعتماد (تُحفظ دائماً)
const SESSION_KEY = "qitars-session"; // جلسة التصفح الحالية فقط — تُمسح عند إغلاق الموقع

const defaultAuth: AuthData = {
  username: "admin",
  password: "12345678",
  loggedIn: false,
};

type AuthContextValue = {
  auth: AuthData;
  ready: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setCredentials: (username: string, password: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthData>(defaultAuth);
  const [ready, setReady] = useState(false);

  // استرجاع بيانات الاعتماد + حالة الجلسة الحالية
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AuthData>;
        setAuth((a) => ({
          ...a,
          username: parsed.username ?? a.username,
          password: parsed.password ?? a.password,
        }));
      }
      // حالة الدخول من جلسة التصفح فقط — لا تُحفظ بعد إغلاق الموقع
      const inSession = sessionStorage.getItem(SESSION_KEY) === "1";
      setAuth((a) => ({ ...a, loggedIn: inSession }));
    } catch {
      /* تجاهل */
    }
    setReady(true);
  }, []);

  // حفظ بيانات الاعتماد فقط (لا تُحفظ حالة الدخول)
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ username: auth.username, password: auth.password })
      );
    } catch {
      /* تجاهل */
    }
  }, [auth.username, auth.password]);

  const value: AuthContextValue = {
    auth,
    ready,
    login: (username, password) => {
      if (username.trim() === auth.username && password === auth.password) {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* تجاهل */
        }
        setAuth((a) => ({ ...a, loggedIn: true }));
        return true;
      }
      return false;
    },
    logout: () => {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        /* تجاهل */
      }
      setAuth((a) => ({ ...a, loggedIn: false }));
    },
    setCredentials: (username, password) =>
      setAuth((a) => ({
        ...a,
        username: username.trim() || a.username,
        password: password || a.password,
      })),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
