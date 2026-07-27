import Link from "next/link";
import { Activity } from "lucide-react";

const columns = [
  {
    heading: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Sign up" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-canvas-line/70">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
              <Activity className="h-5 w-5 text-accent" strokeWidth={2.5} />
              Pulse
            </Link>
            <p className="mt-3 max-w-xs font-body text-sm text-text-muted">
              A live read on how your engineering team is really doing.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="font-body text-sm text-text-muted transition-colors hover:text-text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-canvas-line/70 pt-6 font-mono text-xs text-text-muted md:flex-row md:items-center md:justify-between">
          <span>© 2026 Pulse Labs Inc.</span>
          <span>Built for teams that ship.</span>
        </div>
      </div>
    </footer>
  );
}
