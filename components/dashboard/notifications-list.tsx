"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import clsx from "clsx";
import { CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_READ } from "@/lib/graphql/queries";

type Notification = { id: string; title: string; body: string; time: string; read: boolean };

export function NotificationsList() {
  const { data, loading } = useQuery<{ notifications: Notification[] }>(GET_NOTIFICATIONS);
  const [markRead] = useMutation<{ markNotificationRead: Notification }, { id: string }>(
    MARK_NOTIFICATION_READ
  );

  return (
    <div className="rounded-2xl border border-canvas-line bg-canvas-raised overflow-hidden">
      <ul className="divide-y divide-canvas-line">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="h-20 animate-pulse px-4 py-4" />
          ))}
        {!loading && data?.notifications.length === 0 && (
          <li className="px-4 py-10 text-center font-body text-sm text-text-muted">
            You&apos;re all caught up.
          </li>
        )}
        {data?.notifications.map((n, idx) => (
          <motion.li
            key={n.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
            className={clsx("flex items-start gap-3 px-4 py-4 transition-colors", !n.read && "bg-accent/5")}
          >
            <span
              className={clsx(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full transition-all duration-300",
                n.read ? "bg-canvas-line" : "bg-accent shadow-[0_0_8px_var(--accent)]"
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="font-body text-sm font-medium text-text-primary">{n.title}</p>
              <p className="mt-0.5 font-body text-sm text-text-muted">{n.body}</p>
              <p className="mt-1 font-mono text-xs text-text-muted">{n.time}</p>
            </div>
            {!n.read && (
              <button
                onClick={() =>
                  markRead({
                    variables: { id: n.id },
                    optimisticResponse: {
                      markNotificationRead: { ...n, read: true },
                    },
                  })
                }
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-canvas-line px-3 py-1.5 font-mono text-xs text-text-muted transition-all hover:border-accent hover:text-accent hover:bg-accent/10 active:scale-95"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark read
              </button>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
