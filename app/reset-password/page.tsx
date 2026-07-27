"use client";

import { FormEvent, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { getRegisteredUsers, registerUser } from "@/lib/user-registry";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get("email") || "";
  const tokenParam = searchParams?.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const targetEmail = emailParam || "karanparmar552003@gmail.com";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    // Update password in user registry
    const users = getRegisteredUsers();
    const user = users.find((u) => u.email.toLowerCase() === targetEmail.toLowerCase());

    registerUser(
      targetEmail,
      user?.name || targetEmail.split("@")[0],
      user?.provider || "email",
      password
    );

    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <AuthShell title="Password Reset Successful!" subtitle="">
        <div className="flex flex-col items-center rounded-2xl border border-canvas-line bg-canvas-raised p-8 text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFB454]/20 border border-[#FFB454]/30">
            <CheckCircle2 className="h-6 w-6 text-[#FFB454]" />
          </div>
          <h2 className="font-display text-lg font-semibold text-text-primary">
            Your password has been updated
          </h2>
          <p className="font-body text-xs text-text-muted">
            You can now log in to your Pulse account for <span className="font-semibold text-text-primary">{targetEmail}</span> using your new password.
          </p>
          <Link
            href="/login"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-body text-sm font-semibold text-canvas transition-all hover:opacity-90 active:scale-95"
          >
            Log in with New Password &rarr;
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set New Password"
      subtitle={`Create a new password for ${targetEmail}`}
      footer={
        <Link href="/login" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to log in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          label="New Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={setPassword}
        />
        <FormField
          label="Confirm New Password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirm}
          onChange={setConfirm}
        />

        {error && <p className="font-body text-xs text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-body text-sm font-medium text-canvas transition-all hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Updating Password…
            </>
          ) : (
            <>
              <KeyRound className="h-4 w-4" /> Save & Reset Password
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted">Loading reset form…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
