import { NotificationsList } from "@/components/dashboard/notifications-list";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="mt-1 font-body text-sm text-text-muted">
          Merges, incidents and load alerts that need your attention.
        </p>
      </div>
      <NotificationsList />
    </div>
  );
}
