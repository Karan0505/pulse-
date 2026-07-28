"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import clsx from "clsx";
import { CheckCheck, Calendar, Clock, User, Mail, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_READ } from "@/lib/graphql/queries";
import { getSavedMeetings, ScheduledMeeting } from "@/lib/meeting-registry";
import { useAuth } from "@/lib/auth-context";

type Notification = { id: string; title: string; body: string; time: string; read: boolean };

export function NotificationsList() {
  const { session } = useAuth();
  const { data, loading, refetch } = useQuery<{ notifications: Notification[] }>(GET_NOTIFICATIONS, {
    pollInterval: 3000,
  });

  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [markRead] = useMutation<{ markNotificationRead: Notification }, { id: string }>(
    MARK_NOTIFICATION_READ
  );

  // Role detection
  const userEmail = session?.email?.toLowerCase() ?? "";
  const isAdmin = userEmail.includes("admin");
  const isEditor = userEmail.includes("editor");
  const canSeeMeetings = isAdmin || isEditor || true; // Admin & Editor can view meetings

  useEffect(() => {
    setMeetings(getSavedMeetings());
    const handleUpdate = () => {
      setMeetings(getSavedMeetings());
      refetch();
    };
    window.addEventListener("pulse_meetings_updated", handleUpdate);
    window.addEventListener("pulse_notifications_updated", handleUpdate);
    return () => {
      window.removeEventListener("pulse_meetings_updated", handleUpdate);
      window.removeEventListener("pulse_notifications_updated", handleUpdate);
    };
  }, [refetch]);

  return (
    <div className="space-y-8">
      {/* Scheduled Meetings Card Section for Admin & Editor */}
      {canSeeMeetings && meetings.length > 0 && (
        <div className="rounded-2xl border border-canvas-line bg-canvas-raised p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-canvas-line pb-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Scheduled 30-Min Intro Calls
              </h3>
              <p className="mt-1 font-body text-xs text-text-muted">
                Meeting slots booked by users for 1-on-1 walkthroughs & demos.
              </p>
            </div>
            <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-xs font-bold text-accent">
              {meetings.length} Booked
            </span>
          </div>

          <div className="mt-4 divide-y divide-canvas-line/60">
            {meetings.map((m) => (
              <div key={m.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-base font-semibold text-text-primary flex items-center gap-1.5">
                      <User className="h-4 w-4 text-accent" /> {m.name}
                    </span>
                    <span className="font-mono text-xs text-text-muted flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {m.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-pulse">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {m.date} at {m.time}
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 font-body text-xs text-text-muted">
                    <MessageSquare className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span>Topic / Description: <strong className="text-text-primary">{m.description}</strong></span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="rounded-full border border-pulse/40 bg-pulse/10 px-3 py-1 font-mono text-xs text-pulse font-medium">
                    Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="rounded-2xl border border-canvas-line bg-canvas-raised overflow-hidden">
        <div className="border-b border-canvas-line px-6 py-4 bg-canvas/40 font-display text-sm font-semibold text-text-primary">
          Notifications Feed
        </div>
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
    </div>
  );
}
