"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { LOGIN } from "@/lib/graphql/queries";
import { useAuth } from "@/lib/auth-context";
import { validateUserPassword, getRoleRedirect } from "@/lib/user-registry";

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [login, { loading }] = useMutation<
    { login: { token: string; userEmail: string } },
    { email: string; password: string }
  >(LOGIN);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and password.");
      return;
    }

    // Check account registration & exact password match
    const validation = validateUserPassword(email, password);
    if (validation.status === "NOT_FOUND") {
      setError("Account not found! Please sign up first before logging in.");
      return;
    }
    if (validation.status === "WRONG_PASSWORD") {
      setError("Incorrect password! Please enter the exact password used during sign up.");
      return;
    }

    try {
      const { data } = await login({ variables: { email, password } });
      if (data?.login) {
        setSession({
          email: data.login.userEmail,
          name: validation.user?.name || data.login.userEmail.split("@")[0],
          token: data.login.token,
        });
        const targetPath = getRoleRedirect(data.login.userEmail);
        router.push(targetPath);
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <AuthShell
      title="Log in"
      subtitle="Pick up where your team's pulse left off."
      footer={
        <>
          No account yet?{" "}
          <Link href="/signup" className="text-accent">
            Start free
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <SocialAuthButtons mode="login" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={setEmail}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="font-body text-xs text-text-muted hover:text-text-primary">
              Forgot password?
            </Link>
          </div>

          {error && <p className="font-body text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-body text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Logging in…" : "Log in"}
          </button>

          <p className="text-center font-mono text-xs text-text-muted">
            Demo mode — any email + a 4+ character password works.
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
