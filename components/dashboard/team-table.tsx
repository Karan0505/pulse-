"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Search, UserPlus, X, Trash2, Shield, Edit3, Eye } from "lucide-react";
import clsx from "clsx";
import { GET_TEAM_MEMBERS, INVITE_MEMBER } from "@/lib/graphql/queries";
import { useAuth } from "@/lib/auth-context";

type Member = {
  id: string;
  name: string;
  role: string;
  team: string;
  status: string;
  load: number;
};

export function TeamTable() {
  const { session } = useAuth();
  const { data, loading } = useQuery<{ teamMembers: Member[] }>(GET_TEAM_MEMBERS);
  const [query, setQuery] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [localMembers, setLocalMembers] = useState<Member[] | null>(null);

  // Role detection based on logged in user's email
  const userEmail = session?.email?.toLowerCase() ?? "admin@pulsebackend.com";
  const isViewer = userEmail.includes("viewer");
  const isEditor = userEmail.includes("editor");
  const isAdmin = !isViewer && !isEditor; // default or admin email

  const currentRoleLabel = isAdmin ? "ADMIN" : isEditor ? "EDITOR" : "VIEWER";

  const [inviteMember] = useMutation<
    { inviteMember: Member },
    { email: string; role: string }
  >(INVITE_MEMBER);

  const membersList = useMemo(() => {
    return localMembers ?? data?.teamMembers ?? [];
  }, [localMembers, data]);

  const filtered = useMemo(() => {
    if (!query.trim()) return membersList;
    const q = query.toLowerCase();
    return membersList.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.team.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
    );
  }, [membersList, query]);

  // Admin action: Change Role
  const handleRoleChange = (memberId: string, newRole: string) => {
    setLocalMembers((prev) => {
      const current = prev ?? data?.teamMembers ?? [];
      return current.map((m) => (m.id === memberId ? { ...m, role: newRole } : m));
    });
  };

  // Admin action: Change Status
  const handleStatusChange = (memberId: string, newStatus: string) => {
    setLocalMembers((prev) => {
      const current = prev ?? data?.teamMembers ?? [];
      return current.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m));
    });
  };

  // Admin action: Remove Member
  const handleRemoveMember = (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    setLocalMembers((prev) => {
      const current = prev ?? data?.teamMembers ?? [];
      return current.filter((m) => m.id !== memberId);
    });
  };

  return (
    <div className="rounded-2xl border border-canvas-line bg-canvas-raised">
      {/* Role Badge Indicator */}
      <div className="flex items-center justify-between border-b border-canvas-line px-6 py-3 bg-canvas/40">
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span>Your Active Role:</span>
          <span
            className={clsx(
              "flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold tracking-wider",
              isAdmin && "bg-accent/20 text-accent border border-accent/40 font-mono",
              isEditor && "bg-pulse/20 text-pulse border border-pulse/40 font-mono",
              isViewer && "bg-canvas-line text-text-muted border border-text-muted/30 font-mono"
            )}
          >
            {isAdmin && <Shield className="h-3 w-3" />}
            {isEditor && <Edit3 className="h-3 w-3" />}
            {isViewer && <Eye className="h-3 w-3" />}
            {currentRoleLabel}
          </span>
        </div>
        {isViewer && (
          <span className="font-mono text-xs text-text-muted italic">
            🔒 Read-only view (Inviting and role modifications disabled)
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 border-b border-canvas-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-canvas-line bg-canvas px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, team, role…"
            className="w-full bg-transparent font-body text-sm text-text-primary outline-none placeholder:text-text-muted sm:w-64"
          />
        </div>

        {/* Only Admin can see and click "Invite member" */}
        {isAdmin && (
          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 font-body text-sm font-medium text-canvas transition-opacity hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" /> Invite member
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-canvas-line font-mono text-xs uppercase tracking-wider text-text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Team</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Load</th>
              {isAdmin && <th className="px-4 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-canvas-line">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={isAdmin ? 6 : 5} className="h-14 animate-pulse px-4" />
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="px-4 py-8 text-center font-body text-sm text-text-muted"
                >
                  No members match your search.
                </td>
              </tr>
            )}
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-canvas/30 transition-colors">
                <td className="px-4 py-3 font-body text-sm font-medium text-text-primary">
                  {m.name}
                </td>
                
                {/* Role Column: Editable dropdown for Admin, text for Editor/Viewer */}
                <td className="px-4 py-3 font-body text-sm">
                  {isAdmin ? (
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.id, e.target.value)}
                      className="rounded-md border border-canvas-line bg-canvas px-2.5 py-1 text-xs text-text-primary outline-none focus:border-accent"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  ) : (
                    <span className="text-text-muted">{m.role}</span>
                  )}
                </td>

                <td className="px-4 py-3 font-body text-sm text-text-muted">{m.team}</td>
                
                {/* Status Column: Editable for Admin, badge for others */}
                <td className="px-4 py-3">
                  {isAdmin ? (
                    <select
                      value={m.status}
                      onChange={(e) => handleStatusChange(m.id, e.target.value)}
                      className={clsx(
                        "rounded-full px-2.5 py-0.5 font-mono text-xs border bg-canvas outline-none",
                        m.status === "active"
                          ? "border-pulse/40 text-pulse"
                          : "border-canvas-line text-text-muted"
                      )}
                    >
                      <option value="active">active</option>
                      <option value="invited">invited</option>
                      <option value="suspended">suspended</option>
                    </select>
                  ) : (
                    <span
                      className={clsx(
                        "rounded-full px-2 py-0.5 font-mono text-xs",
                        m.status === "active"
                          ? "bg-pulse/15 text-pulse"
                          : "bg-canvas-line text-text-muted"
                      )}
                    >
                      {m.status}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-canvas-line">
                      <div
                        className={clsx(
                          "h-full rounded-full",
                          m.load > 85 ? "bg-danger" : m.load > 60 ? "bg-accent" : "bg-pulse"
                        )}
                        style={{ width: `${m.load}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-text-muted">{m.load}%</span>
                  </div>
                </td>

                {/* Actions Column: Admin only */}
                {isAdmin && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemoveMember(m.id)}
                      className="rounded-lg p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inviteOpen && isAdmin && (
        <InviteModal
          onClose={() => setInviteOpen(false)}
          onInvite={async (email, role) => {
            const newMember: Member = {
              id: `m-${Date.now()}`,
              name: email.split("@")[0],
              role,
              team: "Unassigned",
              status: "invited",
              load: 0,
            };
            setLocalMembers((prev) => [newMember, ...(prev ?? data?.teamMembers ?? [])]);
            try {
              await inviteMember({ variables: { email, role } });
            } catch {
              // Local fallback state already added
            }
            setInviteOpen(false);
          }}
        />
      )}
    </div>
  );
}

function InviteModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (email: string, role: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [sending, setSending] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-canvas-line bg-canvas-raised p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Invite a member</h3>
          <button onClick={onClose} aria-label="Close" className="text-text-muted hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="mt-2 w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-text-muted">Assign Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
        <button
          disabled={!email.includes("@") || sending}
          onClick={async () => {
            setSending(true);
            await onInvite(email, role);
            setSending(false);
          }}
          className="mt-6 w-full rounded-full bg-accent px-4 py-2.5 font-body text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {sending ? "Sending invite…" : "Send invite"}
        </button>
      </div>
    </div>
  );
}
