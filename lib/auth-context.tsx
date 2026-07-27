"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from "react";

type Session = { email: string; token: string; name?: string } | null;

type AuthContextValue = {
  session: Session;
  ready: boolean;
  setSession: (session: Session) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "pulse.session";
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedSession: Session = null;

function readSession(): Session {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSession = raw ? JSON.parse(raw) : null;
    }
    return cachedSession;
  } catch {
    return null;
  }
}

function writeSession(next: Session) {
  try {
    if (next) {
      const raw = JSON.stringify(next);
      window.localStorage.setItem(STORAGE_KEY, raw);
      cachedRaw = raw;
      cachedSession = next;
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
      cachedRaw = null;
      cachedSession = null;
    }
  } catch {
    // ignore blocked storage
  }
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

const getServerSessionSnapshot = () => null;
const getClientReadySnapshot = () => true;
const getServerReadySnapshot = () => false;

export function AuthProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore reads localStorage as an external store — no
  // effect + setState round trip, and the server snapshot (null) matches
  // the client's first paint so there's no hydration mismatch.
  const session = useSyncExternalStore(
    subscribe,
    readSession,
    getServerSessionSnapshot
  );
  const ready = useSyncExternalStore(
    subscribe,
    getClientReadySnapshot,
    getServerReadySnapshot
  );

  const setSession = useCallback((next: Session) => writeSession(next), []);
  const logout = useCallback(() => writeSession(null), []);

  return (
    <AuthContext.Provider value={{ session, ready, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

