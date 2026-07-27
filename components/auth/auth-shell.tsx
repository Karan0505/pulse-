import Link from "next/link";
import { Activity } from "lucide-react";
import { PulseWaveform } from "@/components/marketing/pulse-waveform";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-canvas-raised p-10 md:flex">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <Activity className="h-5 w-5 text-accent" strokeWidth={2.5} />
          Pulse
        </Link>
        <div>
          <p className="max-w-sm font-display text-2xl font-semibold leading-snug tracking-tight">
            &ldquo;We noticed Kabir was overloaded three weeks before it
            would&apos;ve shown up in a 1:1.&rdquo;
          </p>
          <p className="mt-4 font-mono text-xs text-text-muted">
            Renu Kapoor, Engineering Manager
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 opacity-70">
          <PulseWaveform variant="hero" className="h-full w-full" />
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <Link href="/" className="mb-8 flex items-center gap-2 font-display text-lg font-semibold md:hidden">
          <Activity className="h-5 w-5 text-accent" strokeWidth={2.5} />
          Pulse
        </Link>
        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 font-body text-sm text-text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 font-body text-sm text-text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
