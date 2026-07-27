"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Activity,
  LayoutGrid,
  Radio,
  FileText,
  Users,
  Bell,
  Bot,
  Settings,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/activity", label: "Activity", icon: Radio },
  { href: "/dashboard/blogs", label: "Blogs", icon: FileText },
  { href: "/dashboard/team", label: "Team & Roles", icon: Users },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/assistant", label: "Assistant", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-canvas-line bg-canvas-raised/40 md:flex">
      <Link href="/" className="flex items-center gap-2 px-6 py-5 font-display text-lg font-semibold">
        <Activity className="h-5 w-5 text-accent" strokeWidth={2.5} />
        Pulse
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition-colors",
                active
                  ? "bg-canvas-line text-text-primary"
                  : "text-text-muted hover:bg-canvas-line/50 hover:text-text-primary"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-canvas-line p-4 font-mono text-xs text-text-muted">
        pulse-web · v2.14.0
      </div>
    </aside>
  );
}
