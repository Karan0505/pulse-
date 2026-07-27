import { TeamTable } from "@/components/dashboard/team-table";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Team</h1>
        <p className="mt-1 font-body text-sm text-text-muted">
          Manage roles and keep an eye on load before it becomes a problem.
        </p>
      </div>
      <TeamTable />
    </div>
  );
}
