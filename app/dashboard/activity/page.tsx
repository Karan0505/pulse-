import { ActivityFeedTable } from "@/components/dashboard/activity-feed-table";

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-1 font-body text-sm text-text-muted">
          Every merge, review, deploy and incident across your connected repos.
        </p>
      </div>
      <ActivityFeedTable />
    </div>
  );
}
