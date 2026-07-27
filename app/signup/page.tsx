"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { SIGNUP } from "@/lib/graphql/queries";
import { useAuth } from "@/lib/auth-context";
import { isUserRegistered, registerUser, getRoleRedirect } from "@/lib/user-registry";

export default function SignupPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signup, { loading }] = useMutation<
    { signup: { token: string; userEmail: string } },
    { email: string; password: string }
  >(SIGNUP);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    if (isUserRegistered(email)) {
      setError("An account with this email already exists! Please log in instead.");
      return;
    }

    try {
      const { data } = await signup({ variables: { email, password } });
      if (data?.signup) {
        registerUser(email, email.split("@")[0], "email", password);
        
        // Trigger Welcome Email via Nodemailer
        fetch("/api/auth/send-welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.signup.userEmail, name: email.split("@")[0] }),
        }).catch(() => {});

        setSession({ email: data.signup.userEmail, token: data.signup.token });
        const targetPath = getRoleRedirect(data.signup.userEmail);
        router.push(targetPath);
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <AuthShell
      title="Start free"
      subtitle="Up to 8 members, no card required."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-accent">
            Log in
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <SocialAuthButtons mode="signup" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Work email"
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
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={setPassword}
          />
          <FormField
            label="Confirm password"
            name="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={setConfirm}
          />

          {error && <p className="font-body text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-body text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center font-mono text-xs text-text-muted">
            By continuing you agree to Pulse&apos;s Terms and Privacy Policy.
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
