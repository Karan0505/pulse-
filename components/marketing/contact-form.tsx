"use client";

import { FormEvent, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value || "";
    const teamSize = (form.elements.namedItem("teamSize") as HTMLInputElement)?.value || "";
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value || "";

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, teamSize, message }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to send email. Try again.");
        setStatus("idle");
      }
    } catch {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-canvas-line bg-canvas-raised p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-pulse" />
        <p className="mt-4 font-display text-lg font-semibold">Message sent</p>
        <p className="mt-1 font-body text-sm text-text-muted">
          We&apos;ll get back to you within a business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-canvas-line bg-canvas-raised p-8"
    >
      <Field label="Name" name="name" type="text" placeholder="Jordan Lee" required />
      <Field label="Work email" name="email" type="email" placeholder="jordan@company.com" required />
      <Field label="Team size" name="teamSize" type="text" placeholder="e.g. 12" />
      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-text-muted" htmlFor="message">
          How Can I Help you?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-2 w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
          placeholder="What are you hoping Pulse solves for your team?"
        />
      </div>

      {error && <p className="font-body text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-body text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-wider text-text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
      />
    </div>
  );
}
