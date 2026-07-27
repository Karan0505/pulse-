"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { session, setSession } = useAuth();

  const savedEmail = session?.email || "admin@pulsebackend.com";
  const savedName = session?.name || (session?.email ? session.email.split("@")[0] : "");

  const [email, setEmail] = useState(savedEmail);
  const [name, setName] = useState(savedName);
  const [saved, setSaved] = useState(false);
  const [savedFields, setSavedFields] = useState<{ email: boolean; name: boolean }>({
    email: false,
    name: false,
  });

  useEffect(() => {
    if (session?.email) setEmail(session.email);
    if (session?.name) setName(session.name);
  }, [session?.email, session?.name]);

  const [prefs, setPrefs] = useState({
    incidents: true,
    reviewStall: true,
    weeklyDigest: false,
    loadAlerts: true,
  });

  // Check if fields were modified
  const isEmailChanged = email.trim() !== savedEmail.trim();
  const isNameChanged = name.trim() !== savedName.trim();
  const isAnyChanged = isEmailChanged || isNameChanged;

  const handleSave = () => {
    if (!isAnyChanged || !session) return;

    // Track which fields were updated
    const updatedFields = {
      email: isEmailChanged,
      name: isNameChanged,
    };

    setSession({
      ...session,
      email: email.trim(),
      name: name.trim(),
    });

    setSavedFields(updatedFields);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
      setSavedFields({ email: false, name: false });
    }, 2200);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 font-body text-sm text-text-muted">
          Manage your profile and how Pulse notifies you.
        </p>
      </div>

      {/* Profile Section */}
      <section className="rounded-2xl border border-canvas-line bg-canvas-raised p-6">
        <h2 className="font-display text-base font-semibold">Profile</h2>

        <div className="mt-5 space-y-5">
          {/* Email Input Field */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-text-muted">
              Email
            </label>
            <div className="relative mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-canvas-line bg-canvas px-3.5 py-2.5 pr-10 font-body text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-[#FFB454]"
              />
              {/* Left-to-Right Animated Tick appears inside input box AFTER clicking Save changes */}
              <AnimatePresence>
                {saved && savedFields.email && <LeftToRightCheck />}
              </AnimatePresence>
            </div>
          </div>

          {/* Display Name Input Field */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-text-muted">
              Display Name
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How you'll appear to your team (e.g. Alex Mercer)"
                className="w-full rounded-lg border border-canvas-line bg-canvas px-3.5 py-2.5 pr-10 font-body text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-[#FFB454]"
              />
              {/* Left-to-Right Animated Tick appears inside input box AFTER clicking Save changes */}
              <AnimatePresence>
                {saved && savedFields.name && <LeftToRightCheck />}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="mt-6">
          <button
            disabled={!isAnyChanged && !saved}
            onClick={handleSave}
            className="flex items-center gap-2 rounded-full bg-[#FFB454] px-6 py-2.5 font-body text-sm font-medium text-canvas transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40"
          >
            {saved && <ButtonCheck />}
            {saved ? "Saved successfully!" : "Save changes"}
          </button>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="rounded-2xl border border-canvas-line bg-canvas-raised p-6">
        <h2 className="font-display text-base font-semibold">Notification preferences</h2>
        <div className="mt-4 space-y-4">
          <Toggle
            label="Incident alerts"
            checked={prefs.incidents}
            onChange={(v) => setPrefs((p) => ({ ...p, incidents: v }))}
          />
          <Toggle
            label="Stalled review reminders"
            checked={prefs.reviewStall}
            onChange={(v) => setPrefs((p) => ({ ...p, reviewStall: v }))}
          />
          <Toggle
            label="Weekly digest email"
            checked={prefs.weeklyDigest}
            onChange={(v) => setPrefs((p) => ({ ...p, weeklyDigest: v }))}
          />
          <Toggle
            label="Team load alerts"
            checked={prefs.loadAlerts}
            onChange={(v) => setPrefs((p) => ({ ...p, loadAlerts: v }))}
          />
        </div>
      </section>
    </div>
  );
}

// Custom Left-to-Right Drawing & Sliding Checkmark Animation for Input Box
function LeftToRightCheck() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -14, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 10, scale: 0.8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M4 12.5L9.5 18L20 6"
          stroke="#FFB454"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

// Left-to-Right Drawing & Sliding Checkmark Animation inside Save Button
function ButtonCheck() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center justify-center"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M4 12.5L9.5 18L20 6"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-body text-sm text-text-primary">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-[#FFB454]" : "bg-canvas-line"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-canvas-raised shadow-md transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
