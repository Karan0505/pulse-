"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, LogOut, Activity, User, FileText, GitPullRequest } from "lucide-react";
import clsx from "clsx";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "@/lib/auth-context";
import { NotificationPopover } from "@/components/dashboard/notification-popover";
import { GET_TEAM_MEMBERS, GET_ACTIVITY_FEED, GET_BLOG_POSTS } from "@/lib/graphql/queries";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/activity", label: "Activity" },
  { href: "/dashboard/blogs", label: "Blogs" },
  { href: "/dashboard/team", label: "Team & Roles" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/assistant", label: "Assistant" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function Topbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { session, logout } = useAuth();
  const pathname = usePathname();

  const { data: teamData } = useQuery(GET_TEAM_MEMBERS);
  const { data: activityData } = useQuery(GET_ACTIVITY_FEED);
  const { data: blogData } = useQuery(GET_BLOG_POSTS);

  const query = searchQuery.trim().toLowerCase();

  const filteredMembers = query
    ? (teamData?.teamMembers || []).filter(
        (m: { name: string; role: string; team: string }) =>
          m.name.toLowerCase().includes(query) ||
          m.role.toLowerCase().includes(query) ||
          m.team.toLowerCase().includes(query)
      )
    : [];

  const filteredActivities = query
    ? (activityData?.activityFeed || []).filter(
        (a: { actor: string; detail: string; repo: string }) =>
          a.actor.toLowerCase().includes(query) ||
          a.detail.toLowerCase().includes(query) ||
          a.repo.toLowerCase().includes(query)
      )
    : [];

  const filteredBlogs = query
    ? (blogData?.blogPosts || []).filter(
        (b: { title: string; excerpt: string; tag: string }) =>
          b.title.toLowerCase().includes(query) ||
          b.excerpt.toLowerCase().includes(query) ||
          b.tag.toLowerCase().includes(query)
      )
    : [];

  const totalResults = filteredMembers.length + filteredActivities.length + filteredBlogs.length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-canvas-line px-4 py-3 md:px-8">
        <button
          className="text-text-primary md:hidden"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Global Live Search Input with Dropdown */}
        <div ref={searchRef} className="relative hidden max-w-md flex-1 md:block">
          <div className="flex items-center gap-2 rounded-lg border border-canvas-line bg-canvas-raised px-3 py-2 transition-all focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30">
            <Search className="h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search PRs, people, repos…"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              className="w-full bg-transparent font-body text-sm text-text-primary outline-none placeholder:text-text-muted"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Search Autocomplete Results Popover */}
          {isSearchOpen && query.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-canvas-line bg-canvas-raised p-3 shadow-2xl backdrop-blur-md">
              {totalResults === 0 ? (
                <div className="py-6 text-center font-body text-xs text-text-muted">
                  No matching team members, repos, or PRs found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Team Members Category */}
                  {filteredMembers.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 px-2 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        <User className="h-3 w-3 text-accent" /> Team Members ({filteredMembers.length})
                      </div>
                      <div className="space-y-1">
                        {filteredMembers.slice(0, 3).map((m: { id: string; name: string; role: string; team: string }) => (
                          <Link
                            key={m.id}
                            href="/dashboard/team"
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-canvas-line/40 transition-colors"
                          >
                            <span className="font-medium">{m.name}</span>
                            <span className="font-mono text-[10px] text-text-muted">{m.role} • {m.team}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activity Events */}
                  {filteredActivities.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 px-2 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        <GitPullRequest className="h-3 w-3 text-[#FFB454]" /> Activity Logs ({filteredActivities.length})
                      </div>
                      <div className="space-y-1">
                        {filteredActivities.slice(0, 3).map((a: { id: string; actor: string; detail: string; repo: string }) => (
                          <Link
                            key={a.id}
                            href="/dashboard/activity"
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-canvas-line/40 transition-colors"
                          >
                            <span className="truncate font-medium">{a.actor} {a.detail}</span>
                            <span className="shrink-0 font-mono text-[10px] text-accent">{a.repo}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blog Posts */}
                  {filteredBlogs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 px-2 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        <FileText className="h-3 w-3 text-pulse" /> Blog Posts ({filteredBlogs.length})
                      </div>
                      <div className="space-y-1">
                        {filteredBlogs.slice(0, 2).map((b: { id: string; title: string; tag: string }) => (
                          <Link
                            key={b.id}
                            href="/dashboard/blogs"
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-canvas-line/40 transition-colors"
                          >
                            <span className="truncate font-medium">{b.title}</span>
                            <span className="shrink-0 font-mono text-[10px] text-text-muted">{b.tag}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Interactive Notification Bell Popover with badge badge & dropdown */}
          <NotificationPopover />

          <div className="hidden items-center gap-2 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 font-mono text-xs font-semibold text-accent border border-accent/40">
              {(session?.name || session?.email)?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className="max-w-[10rem] truncate font-body text-sm text-text-primary font-medium">
              {session?.name || session?.email}
            </span>
          </div>

          <button
            onClick={logout}
            className="text-text-muted hover:text-danger p-1.5 rounded-lg hover:bg-canvas-line/30 transition-colors"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-canvas/95 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="flex items-center gap-2 font-display text-lg font-semibold">
              <Activity className="h-5 w-5 text-accent" strokeWidth={2.5} />
              Pulse
            </span>
            <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={clsx(
                  "rounded-lg px-4 py-3 font-body text-base",
                  pathname === item.href
                    ? "bg-canvas-raised text-text-primary"
                    : "text-text-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
