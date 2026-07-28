"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  ADD_NOTIFICATION,
} from "@/lib/graphql/queries";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevUnreadRef = useRef<number | null>(null);

  // Fetch dynamic notifications from Apollo GraphQL query with polling
  const { data, refetch } = useQuery<{ notifications: NotificationItem[] }>(
    GET_NOTIFICATIONS,
    { pollInterval: 3000 }
  );

  const [markReadMutation] = useMutation<{ markNotificationRead: NotificationItem }, { id: string }>(
    MARK_NOTIFICATION_READ
  );

  const [addNotificationMutation] = useMutation<
    { addNotification: NotificationItem },
    { title: string; body: string }
  >(ADD_NOTIFICATION);

  const items = data?.notifications ?? [];
  const unreadCount = items.filter((n) => !n.read).length;

  // Trigger vigorous bell ring animation
  const ringBell = () => {
    setIsRinging(true);
    setTimeout(() => setIsRinging(false), 1200);
  };

  // Ring bell whenever unread count increases dynamically
  useEffect(() => {
    if (prevUnreadRef.current !== null && unreadCount > prevUnreadRef.current) {
      ringBell();
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  // Function to add a new notification dynamically via GraphQL mutation
  const handleAddNotification = async (title?: string, body?: string) => {
    const t = title || `New System Alert #${Math.floor(Math.random() * 100)}`;
    const b = body || "A new update or activity was detected on your Pulse workflow.";
    await addNotificationMutation({
      variables: { title: t, body: b },
      refetchQueries: [{ query: GET_NOTIFICATIONS }],
    });
    ringBell();
  };

  // Close when clicking outside & listen for custom new-notification event
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleNewNotificationEvent(e: Event) {
      const customEvent = e as CustomEvent<{ title?: string; body?: string }>;
      handleAddNotification(customEvent.detail?.title, customEvent.detail?.body);
    }
    function handlePulseNotifUpdate() {
      refetch();
      ringBell();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("new-notification", handleNewNotificationEvent);
    window.addEventListener("pulse_notifications_updated", handlePulseNotifUpdate);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("new-notification", handleNewNotificationEvent);
      window.removeEventListener("pulse_notifications_updated", handlePulseNotifUpdate);
    };
  }, []);

  const markAllAsRead = () => {
    items.forEach((n) => {
      if (!n.read) {
        markReadMutation({
          variables: { id: n.id },
          optimisticResponse: {
            markNotificationRead: { ...n, read: true },
          },
        });
      }
    });
    refetch();
  };

  const toggleRead = (id: string) => {
    const target = items.find((n) => n.id === id);
    if (!target) return;
    markReadMutation({
      variables: { id },
      optimisticResponse: {
        markNotificationRead: { ...target, read: !target.read },
      },
    });
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Trigger Button with Ringing & Pulsing Animations */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-text-muted hover:text-text-primary transition-all outline-none rounded-full hover:bg-canvas-line/40 group active:scale-95"
        aria-label="Notifications"
      >
        {/* Shockwave Ripple Effect when a New Notification Arrives */}
        <AnimatePresence>
          {isRinging && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[#FFB454]/40 border border-[#FFB454]"
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={
            isRinging
              ? {
                  rotate: [0, -32, 32, -24, 24, -16, 16, -8, 8, 0],
                  scale: [1, 1.3, 1.15, 1],
                }
              : unreadCount > 0
              ? {
                  rotate: [0, -15, 15, -10, 10, -5, 5, 0],
                  scale: [1, 1.05, 1],
                }
              : {}
          }
          transition={
            isRinging
              ? { duration: 0.9, ease: "easeInOut" }
              : {
                  repeat: Infinity,
                  repeatDelay: 3.5,
                  duration: 0.7,
                  ease: "easeInOut",
                }
          }
          whileHover={{
            rotate: [0, -20, 20, -10, 10, 0],
            transition: { duration: 0.4 },
          }}
        >
          <Bell className="h-5 w-5 transition-colors group-hover:text-accent" />
        </motion.div>

        {unreadCount > 0 && (
          <div className="absolute top-0.5 right-0.5 flex items-center justify-center">
            {/* Continuous Pulsing Beacon Ring */}
            <span className="absolute h-full w-full rounded-full bg-[#FFB454] opacity-75 animate-ping" />
            
            {/* Glowing Backdrop */}
            <span className="absolute h-3.5 w-3.5 rounded-full bg-[#FFB454]/50 blur-[2px]" />

            {/* Animated Badge */}
            <motion.span
              key={unreadCount}
              initial={{ scale: 0, rotate: -25 }}
              animate={
                isRinging
                  ? { scale: [1, 1.35, 1], rotate: [0, -10, 10, 0] }
                  : { scale: 1, rotate: 0 }
              }
              exit={{ scale: 0 }}
              transition={
                isRinging
                  ? { duration: 0.6, ease: "easeInOut" }
                  : { type: "spring", stiffness: 500, damping: 20 }
              }
              className="relative flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FFB454] px-1 font-mono text-[10px] font-bold text-canvas shadow-lg shadow-[#FFB454]/50"
            >
              {unreadCount}
            </motion.span>
          </div>
        )}
      </button>

      {/* Floating Dropdown Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-canvas-line bg-canvas-raised/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-canvas-line px-4 py-3 bg-canvas/60">
              <div className="flex items-center gap-2">
                <h4 className="font-display text-sm font-semibold text-text-primary">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="rounded-full bg-[#FFB454]/20 px-2 py-0.5 font-mono text-[11px] font-medium text-[#FFB454] border border-[#FFB454]/30"
                  >
                    {unreadCount} new
                  </motion.span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Trigger Dynamic Notification Button */}
                <button
                  onClick={() => handleAddNotification()}
                  className="rounded-lg bg-accent/10 px-2 py-1 font-mono text-[11px] text-accent border border-accent/20 hover:bg-accent/20 transition-all active:scale-95"
                  title="Simulate dynamic GraphQL incoming notification & ring bell"
                >
                  + Demo Alert
                </button>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 font-body text-xs text-text-muted hover:text-[#FFB454] transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" /> Mark all
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-canvas-line/50">
              {items.length === 0 ? (
                <div className="p-6 text-center font-body text-xs text-text-muted">
                  No notifications yet.
                </div>
              ) : (
                items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    onClick={() => toggleRead(item.id)}
                    className={`flex items-start gap-3 p-3.5 transition-all cursor-pointer hover:bg-canvas/60 ${
                      !item.read ? "bg-[#FFB454]/5 hover:bg-[#FFB454]/10" : ""
                    }`}
                  >
                    <div className="mt-1">
                      <span
                        className={`block h-2 w-2 rounded-full transition-all duration-300 ${
                          !item.read
                            ? "bg-[#FFB454] shadow-[0_0_8px_#FFB454]"
                            : "bg-transparent border border-canvas-line"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="font-body text-xs font-semibold text-text-primary truncate">
                          {item.title}
                        </h5>
                        <span className="font-mono text-[10px] text-text-muted shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-0.5 font-body text-xs text-text-muted line-clamp-2">
                        {item.body}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-canvas-line bg-canvas/80 p-2.5 text-center">
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-[#FFB454] hover:underline hover:brightness-110 transition-all"
              >
                View all notifications <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
