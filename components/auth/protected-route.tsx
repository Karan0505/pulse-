"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Activity } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !session) {
      router.replace("/login");
    }
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Activity className="h-6 w-6 animate-pulse text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
