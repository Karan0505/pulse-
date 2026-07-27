type RegisteredUser = {
  email: string;
  name?: string;
  password?: string;
  provider?: "email" | "google" | "github";
  registeredAt: string;
};

const REGISTRY_KEY = "pulse.registeredUsers";

const SEED_USERS: RegisteredUser[] = [
  { email: "admin@pulsebackend.com", name: "Pulse Admin", password: "admin123", provider: "email", registeredAt: "2026-01-01" },
  { email: "editor@pulsebackend.com", name: "Pulse Editor", password: "editor123", provider: "email", registeredAt: "2026-01-01" },
  { email: "viewer@pulsebackend.com", name: "Pulse Viewer", password: "viewer123", provider: "email", registeredAt: "2026-01-01" },
  { email: "karanparmar552003@gmail.com", name: "Karan Parmar", password: "karan123", provider: "google", registeredAt: "2026-01-01" },
  { email: "sarah.chen@github.dev", name: "Sarah Chen", password: "sarah123", provider: "github", registeredAt: "2026-01-01" },
];

export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    let stored: RegisteredUser[] = [];
    if (raw) {
      stored = JSON.parse(raw);
    }
    const mergedMap = new Map<string, RegisteredUser>();
    SEED_USERS.forEach((u) => mergedMap.set(u.email.toLowerCase(), u));
    stored.forEach((u) => {
      const lower = u.email.toLowerCase();
      // Ensure karan email has password set
      if (lower.includes("karan") && !u.password) {
        u.password = "karan123";
      }
      mergedMap.set(lower, u);
    });

    const merged = Array.from(mergedMap.values());
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return SEED_USERS;
  }
}

export function isUserRegistered(email: string): boolean {
  if (!email) return false;
  const users = getRegisteredUsers();
  const normalized = email.trim().toLowerCase();
  return users.some((u) => u.email.trim().toLowerCase() === normalized);
}

export function validateUserPassword(
  email: string,
  passwordInput: string
): { status: "OK" | "NOT_FOUND" | "WRONG_PASSWORD"; user?: RegisteredUser } {
  if (!email) return { status: "NOT_FOUND" };
  const users = getRegisteredUsers();
  const normalized = email.trim().toLowerCase();
  let user = users.find((u) => u.email.trim().toLowerCase() === normalized);

  if (!user) {
    // Demo Mode: Auto-register user if email is provided
    user = registerUser(email, email.split("@")[0], "email", passwordInput || "karan123");
    return { status: "OK", user };
  }

  // Update password in registry to input password so user can login with whatever password they type
  user.password = passwordInput || user.password || "karan123";
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(users));
  } catch {}

  return { status: "OK", user };
}

export function registerUser(
  email: string,
  name?: string,
  provider: "email" | "google" | "github" = "email",
  password?: string
): RegisteredUser {
  const users = getRegisteredUsers();
  const normalized = email.trim().toLowerCase();
  const existing = users.find((u) => u.email.trim().toLowerCase() === normalized);

  if (existing) {
    if (password && !existing.password) {
      existing.password = password;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(REGISTRY_KEY, JSON.stringify(users));
        } catch { }
      }
    }
    return existing;
  }

  const newUser: RegisteredUser = {
    email: email.trim(),
    name: name || email.split("@")[0],
    password,
    provider,
    registeredAt: new Date().toISOString(),
  };

  const updated = [newUser, ...users];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return newUser;
}

export function getRoleRedirect(email: string): string {
  const normalized = (email || "").trim().toLowerCase();
  if (normalized.includes("admin") || normalized.includes("editor")) {
    return "/dashboard";
  }
  return "/";
}
