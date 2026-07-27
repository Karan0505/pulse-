"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Activity, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { NotificationPopover } from "@/components/dashboard/notification-popover";
import { SmokeButton } from "@/components/ui/smoke-button";

const links = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { session, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-canvas-line/70 bg-canvas/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <Activity className="h-5 w-5 text-accent" strokeWidth={2.5} />
          Pulse
        </Link>

        <ul className="hidden items-center gap-8 font-body text-sm text-text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-text-primary">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              {/* Notification Bell */}
              <NotificationPopover />

              <span className="font-mono text-xs text-text-muted max-w-[12rem] truncate font-medium">
                {session?.name || session?.email}
              </span>

              {/* Smoke Dissolve Reveal Button */}
              <SmokeButton
                href="/dashboard"
                variant="primary"
                icon={<LayoutDashboard className="h-4 w-4" />}
                hoverText="Open Portal 🚀"
              >
                Go to Dashboard
              </SmokeButton>

              <button
                onClick={logout}
                className="p-2 text-text-muted hover:text-danger transition-colors"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-body text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                Log in
              </Link>

              {/* Smoke Dissolve Reveal Button */}
              <SmokeButton href="/signup" variant="primary" hoverText="Get Started ⚡">
                Start free
              </SmokeButton>
            </>
          )}
        </div>

        <button
          className="text-text-primary md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-canvas-line/70 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4 font-body text-sm text-text-muted">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="hover:text-text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            {session ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-muted truncate">{session?.name || session?.email}</span>
                  <NotificationPopover />
                </div>
                <SmokeButton
                  href="/dashboard"
                  variant="primary"
                  hoverText="Open Portal 🚀"
                  onClick={() => setOpen(false)}
                >
                  Go to Dashboard
                </SmokeButton>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-left text-sm text-danger hover:underline"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-sm text-text-muted hover:text-text-primary">
                  Log in
                </Link>
                <SmokeButton href="/signup" variant="primary" hoverText="Get Started ⚡" onClick={() => setOpen(false)}>
                  Start free
                </SmokeButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
