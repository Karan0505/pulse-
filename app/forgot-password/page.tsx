"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck, ExternalLink, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { isUserRegistered } from "@/lib/user-registry";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentData, setSentData] = useState<{ resetUrl: string; testUrl?: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    // Check if user account is registered
    if (!isUserRegistered(email)) {
      setError("No account found with this email! Please check the email or sign up first.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-reset-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSentData({
          resetUrl: data.resetUrl,
          testUrl: data.testUrl,
        });
      } else {
        setError(data.error || "Failed to send reset email. Please try again.");
      }
    } catch {
      setLoading(false);
      setError("Server error while sending reset email.");
    }
  }

  if (sentData) {
    return (
      <AuthShell title="Check your email 📬" subtitle="Password reset link sent to your inbox">
        <div className="flex flex-col items-center rounded-2xl border border-canvas-line bg-canvas-raised p-8 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFB454]/20 border border-[#FFB454]/30 animate-pulse">
            <MailCheck className="h-7 w-7 text-[#FFB454]" />
          </div>

          <div>
            <p className="font-body text-sm text-text-primary">
              We have sent a password reset link to:
            </p>
            <p className="mt-1.5 font-mono text-xs font-semibold text-[#FFB454] bg-[#FFB454]/10 px-3.5 py-1.5 rounded-lg inline-block border border-[#FFB454]/20">
              {email}
            </p>
          </div>

          <p className="font-body text-xs text-text-muted max-w-xs leading-relaxed">
            Please check your email inbox and click the link inside the email to reset your password.
          </p>

          <div className="pt-4 border-t border-canvas-line w-full flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 font-body text-xs font-medium text-accent hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to log in
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your registered email and Nodemailer will send a reset link."
      footer={
        <Link href="/login" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to log in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          label="Registered Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={setEmail}
        />

        {error && <p className="font-body text-xs text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-body text-sm font-medium text-canvas transition-all hover:opacity-90 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Sending Email via Nodemailer…" : "Send Reset Link"}
        </button>

        <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-text-muted pt-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#FFB454]" /> Secure Nodemailer SMTP Transmission
        </div>
      </form>
    </AuthShell>
  );
}
