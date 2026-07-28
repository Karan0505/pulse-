"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GitMerge,
  MessageSquare,
  Rocket,
  TriangleAlert,
  Search,
  FolderPlus,
  Plus,
  Folder,
  ChevronDown,
  ChevronRight,
  FileCode,
  X,
  Layers,
  Lock,
  Pencil,
  Trash2,
  Palette,
  Code2,
  Server,
  Cpu,
  ShieldCheck,
  Zap,
  Bot,
} from "lucide-react";
import {
  GET_ACTIVITY_FEED,
  GET_PROJECTS,
  ADD_PROJECT,
  ADD_ACTIVITY_EVENT,
  UPDATE_ACTIVITY_EVENT,
  DELETE_ACTIVITY_EVENT,
  DELETE_PROJECT,
} from "@/lib/graphql/queries";
import { useAuth } from "@/lib/auth-context";

type Event = {
  id: string;
  type: string;
  actor: string;
  detail: string;
  repo: string;
  time: string;
  createdAt?: string;
};

type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
};

const iconFor: Record<string, typeof GitMerge> = {
  merge: GitMerge,
  review: MessageSquare,
  comment: MessageSquare,
  deploy: Rocket,
  incident: TriangleAlert,
  uiux: Palette,
  frontend: Code2,
  backend: Server,
  api: Cpu,
  security: ShieldCheck,
  performance: Zap,
  ai: Bot,
};

const colorFor: Record<string, string> = {
  merge: "text-pulse",
  review: "text-accent",
  comment: "text-accent",
  deploy: "text-pulse",
  incident: "text-danger",
  uiux: "text-cyan-400",
  frontend: "text-cyan-400",
  backend: "text-emerald-400",
  api: "text-purple-400",
  security: "text-pink-400",
  performance: "text-amber-400",
  ai: "text-amber-400",
};

type SelectOption = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const eventTypeOptions: SelectOption[] = [
  { value: "comment", label: "Comment / Discussion", icon: MessageSquare },
  { value: "uiux", label: "UI/UX Design Completed", icon: Palette },
  { value: "frontend", label: "Front-End Feature (Next.js/React)", icon: Code2 },
  { value: "backend", label: "Back-End Service (Node/Express/Prisma)", icon: Server },
  { value: "api", label: "API & GraphQL Integration", icon: Cpu },
  { value: "security", label: "Security & Auth (JWT/OAuth)", icon: ShieldCheck },
  { value: "performance", label: "Performance Optimization", icon: Zap },
  { value: "ai", label: "AI Service & Bot Integration", icon: Bot },
  { value: "review", label: "Code Review", icon: MessageSquare },
  { value: "merge", label: "Git Merge", icon: GitMerge },
  { value: "deploy", label: "Production Deploy", icon: Rocket },
  { value: "incident", label: "Incident / Bug Fix", icon: TriangleAlert },
];

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className || ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm font-medium text-text-primary outline-none focus:border-accent transition-colors shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOpt?.icon && <selectedOpt.icon className="h-4 w-4 shrink-0 text-accent" />}
          <span className="truncate">{selectedOpt?.label || placeholder}</span>
        </div>

        {/* Animated Arrow Icon that rotates UP (180deg) when open, DOWN (0deg) when closed */}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180 text-accent" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-canvas-line bg-canvas-raised p-1 shadow-2xl backdrop-blur-md">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const OptIcon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-body text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-accent/20 text-accent font-semibold"
                    : "text-text-primary hover:bg-canvas hover:text-accent"
                }`}
              >
                {OptIcon && <OptIcon className={`h-4 w-4 shrink-0 ${isSelected ? "text-accent" : "text-text-muted"}`} />}
                <span className="truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ActivityFeedTable({ limit, loading: externalLoading }: { limit?: number; loading?: boolean } = {}) {
  const { session } = useAuth();
  const userEmail = (session?.email || "").toLowerCase();
  
  // Only Admin and Editor have permission to create folders and add/edit activities
  const isAdminOrEditor = !session || userEmail.includes("admin") || userEmail.includes("editor");

  // Page visibility state to pause polling when tab is hidden
  const [isPageVisible, setIsPageVisible] = useState(true);
  useEffect(() => {
    const handleVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const { data: activityData, loading: queryLoading, refetch: refetchActivity } = useQuery<{
    activityFeed: Event[];
  }>(GET_ACTIVITY_FEED, {
    pollInterval: limit || !isPageVisible ? undefined : 10000,
  });

  const activityLoading = externalLoading ?? queryLoading;

  const { data: projectsData, refetch: refetchProjects } = useQuery<{
    projects: Project[];
  }>(GET_PROJECTS);

  const [addProjectMutation] = useMutation(ADD_PROJECT);
  const [addActivityEventMutation] = useMutation(ADD_ACTIVITY_EVENT);
  const [updateActivityEventMutation] = useMutation(UPDATE_ACTIVITY_EVENT);
  const [deleteActivityEventMutation] = useMutation(DELETE_ACTIVITY_EVENT);
  const [deleteProjectMutation] = useMutation(DELETE_PROJECT);

  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");

  // Live ticker state to re-evaluate relative timestamps every 5 seconds
  const [nowTick, setNowTick] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Persistent in-memory map initialized once on mount
  const createdTimesRef = useRef<Record<string, number>>({});
  const persistentMapRef = useRef<Record<string, number>>({});
  const mapLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !mapLoadedRef.current) {
      try {
        const savedMap = localStorage.getItem("pulse_event_created_at_map");
        if (savedMap) {
          persistentMapRef.current = JSON.parse(savedMap) || {};
        }
      } catch (err) {}
      mapLoadedRef.current = true;
    }
  }, []);

  const getEventCreatedMs = (e: Event): number => {
    if (createdTimesRef.current[e.id]) {
      return createdTimesRef.current[e.id];
    }

    if (e.createdAt) {
      const ms = new Date(e.createdAt).getTime();
      if (!isNaN(ms) && ms > 0) {
        createdTimesRef.current[e.id] = ms;
        return ms;
      }
    }

    if (persistentMapRef.current[e.id]) {
      createdTimesRef.current[e.id] = persistentMapRef.current[e.id];
      return persistentMapRef.current[e.id];
    }

    const now = Date.now();
    const str = (e.time || "").trim().toLowerCase();
    let createdMs = now;

    if (str === "just now" || str === "justnow" || !str) {
      createdMs = now - 2000;
    } else {
      const match = str.match(/^(\d+)\s*([smhd])\s*ago$/);
      if (match) {
        const val = parseInt(match[1], 10);
        const unit = match[2];
        let offset = 0;
        if (unit === "s") offset = val * 1000;
        else if (unit === "m") offset = val * 60 * 1000;
        else if (unit === "h") offset = val * 3600 * 1000;
        else if (unit === "d") offset = val * 86400 * 1000;
        createdMs = now - offset;
      } else {
        createdMs = now;
      }
    }

    createdTimesRef.current[e.id] = createdMs;
    persistentMapRef.current[e.id] = createdMs;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("pulse_event_created_at_map", JSON.stringify(persistentMapRef.current));
      } catch (err) {}
    }

    return createdMs;
  };

  const getDynamicRelativeTime = (e: Event) => {
    const createdMs = getEventCreatedMs(e);
    const diffSeconds = Math.floor((nowTick - createdMs) / 1000);

    if (diffSeconds < 10) return "Just now";
    if (diffSeconds < 60) return `${Math.max(1, diffSeconds)}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  const [selectedProject, setSelectedProject] = useState<string>("all");

  // Track collapsed state for folders
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});

  // Modals state
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventRepo, setEventRepo] = useState("");
  const [eventType, setEventType] = useState("comment");
  const [eventActor, setEventActor] = useState("");
  const [eventDetail, setEventDetail] = useState("");

  // Edit Event state
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editDetail, setEditDetail] = useState("");
  const [editType, setEditType] = useState("comment");
  const [editActor, setEditActor] = useState("");
  const [editRepo, setEditRepo] = useState("");

  // Extract all unique project names from projects list & activity data
  const projectList = useMemo(() => {
    const names = new Set<string>();
    if (projectsData?.projects) {
      projectsData.projects.forEach((p) => names.add(p.name));
    }
    if (activityData?.activityFeed) {
      activityData.activityFeed.forEach((e) => names.add(e.repo));
    }
    return Array.from(names);
  }, [projectsData, activityData]);

  // Group events by Project Folder
  const groupedByProject = useMemo(() => {
    let events = activityData?.activityFeed ?? [];

    if (type !== "all") {
      events = events.filter((e) => e.type === type);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      events = events.filter(
        (e) =>
          e.actor.toLowerCase().includes(q) ||
          e.detail.toLowerCase().includes(q) ||
          e.repo.toLowerCase().includes(q)
      );
    }

    const groups: Record<string, Event[]> = {};
    // Initialize all project folders
    projectList.forEach((p) => {
      groups[p] = [];
    });

    events.forEach((e) => {
      if (!groups[e.repo]) {
        groups[e.repo] = [];
      }
      groups[e.repo].push(e);
    });

    return groups;
  }, [activityData, type, query, projectList]);

  // Filter which project folders to display based on selected folder and user role/ownership
  const activeProjectFolders = useMemo(() => {
    if (selectedProject !== "all") {
      return [selectedProject];
    }
    // If not Admin/Editor, isolate to only show project(s) belonging to this logged-in user
    if (!isAdminOrEditor && userEmail) {
      const userHandle = userEmail.split("@")[0].toLowerCase();
      const userOwnProjects = projectList.filter((p) => {
        const pLower = p.toLowerCase();
        if (pLower.includes(userHandle)) return true;
        if (userHandle.includes("karan") && (pLower.includes("karan") || pLower.includes("service"))) return true;
        // Check if user has activity in this repo
        return (groupedByProject[p] || []).some((e) => e.actor.toLowerCase().includes(userHandle));
      });

      return userOwnProjects.length > 0 ? userOwnProjects : [projectList[0] || "my-project"];
    }

    return projectList;
  }, [selectedProject, projectList, isAdminOrEditor, userEmail, groupedByProject]);

  const toggleFolder = (folderName: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const formattedName = newProjectName.trim().toLowerCase().replace(/\s+/g, "-");
    await addProjectMutation({
      variables: {
        name: formattedName,
        description: newProjectDesc.trim() || undefined,
      },
    });

    setNewProjectName("");
    setNewProjectDesc("");
    setIsAddProjectOpen(false);
    setSelectedProject(formattedName);
    refetchProjects();
    refetchActivity();
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetRepo = eventRepo || (selectedProject !== "all" ? selectedProject : projectList[0] || "pulse-api");
    if (!eventActor.trim() || !eventDetail.trim()) return;

    await addActivityEventMutation({
      variables: {
        type: eventType,
        actor: eventActor.trim(),
        detail: eventDetail.trim(),
        repo: targetRepo,
      },
    });

    setEventActor("");
    setEventDetail("");
    setIsAddEventOpen(false);
    refetchActivity();
    refetchProjects();
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="rounded-2xl border border-canvas-line bg-canvas-raised p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-base font-semibold text-text-primary flex items-center gap-2">
              <Folder className="h-5 w-5 text-pulse" />
              <span>Project Folders</span>
            </h3>

            {!limit && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-text-muted">Folder Filter:</span>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="rounded-lg border border-canvas-line bg-canvas px-3 py-1.5 font-body text-sm font-medium text-text-primary outline-none focus:border-pulse"
                >
                  <option value="all">📁 All Project Folders ({projectList.length})</option>
                  {projectList.map((p) => {
                    const count = groupedByProject[p]?.length || 0;
                    return (
                      <option key={p} value={p}>
                        📂 folder / {p} ({count} files/events)
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          {!limit && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Input */}
              <div className="flex items-center gap-2 rounded-lg border border-canvas-line bg-canvas px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-text-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter inside folders…"
                  className="w-36 bg-transparent font-body text-sm text-text-primary outline-none placeholder:text-text-muted sm:w-44"
                />
              </div>

              {/* Type Selector */}
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-lg border border-canvas-line bg-canvas px-3 py-1.5 font-body text-sm text-text-primary outline-none"
              >
                <option value="all">All Types</option>
                <option value="merge">Merges</option>
                <option value="review">Reviews</option>
                <option value="deploy">Deploys</option>
                <option value="incident">Incidents</option>
                <option value="comment">Comments</option>
              </select>


              {isAdminOrEditor ? (
                <>
                  <button
                    onClick={() => setIsAddProjectOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 font-body text-sm font-semibold text-canvas shadow hover:opacity-90 transition-opacity"
                  >
                    <FolderPlus className="h-4 w-4" />
                    <span>New Folder</span>
                  </button>

                  <button
                    onClick={() => {
                      setEventRepo(selectedProject !== "all" ? selectedProject : projectList[0] || "pulse-api");
                      setIsAddEventOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 font-body text-sm font-semibold text-canvas shadow hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add File / Activity</span>
                  </button>
                </>
              ) : (
                <span className="flex items-center gap-1.5 rounded-lg border border-canvas-line bg-canvas px-3 py-1.5 font-mono text-xs text-text-muted">
                  <Lock className="h-3.5 w-3.5 text-text-muted" />
                  <span>View Only (Read-Only)</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Project Folder Pills Bar */}
        {!limit && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-canvas-line pt-3">
            <span className="font-mono text-xs text-text-muted mr-1">Folders:</span>
            <button
              onClick={() => setSelectedProject("all")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-all ${selectedProject === "all"
                  ? "bg-accent text-canvas font-semibold shadow"
                  : "bg-canvas border border-canvas-line text-text-muted hover:text-text-primary"
                }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>All Folders</span>
            </button>
            {projectList.map((p) => {
              const isSelected = selectedProject === p;
              const count = groupedByProject[p]?.length || 0;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedProject(p)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-all ${isSelected
                      ? "bg-accent text-canvas font-semibold shadow"
                      : "bg-canvas border border-canvas-line text-text-muted hover:text-text-primary hover:border-accent/50"
                    }`}
                >
                  <Folder className="h-3.5 w-3.5" />
                  <span>{p}</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isSelected ? "bg-canvas/30 text-canvas font-bold" : "bg-accent/15 border border-accent/30 text-accent font-mono"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Folders Container List */}
      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
        {activityLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-canvas-line bg-canvas-raised p-4 animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded bg-canvas-line/60" />
                    <div className="h-4 w-40 rounded bg-canvas-line/60" />
                  </div>
                  <div className="h-6 w-16 rounded-full bg-canvas-line/60" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-10 w-full rounded-lg bg-canvas-line/30" />
                  <div className="h-10 w-full rounded-lg bg-canvas-line/30" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!activityLoading && activeProjectFolders.length === 0 && (
          <div className="rounded-2xl border border-canvas-line bg-canvas-raised p-8 text-center text-text-muted font-body text-sm">
            No project folders available. Create a new folder to get started!
          </div>
        )}

        {!activityLoading &&
          activeProjectFolders.map((folderName) => {
            const items = groupedByProject[folderName] || [];
            const isCollapsed = collapsedFolders[folderName] ?? false;

            return (
              <div
                key={folderName}
                className="rounded-2xl border border-canvas-line bg-canvas-raised overflow-hidden shadow-sm transition-all"
              >
                {/* Folder Header Bar */}
                <div
                  className="flex items-center justify-between border-b border-canvas-line bg-canvas/70 px-4 py-3 cursor-pointer hover:bg-canvas transition-colors"
                  onClick={() => toggleFolder(folderName)}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-text-muted hover:text-text-primary">
                      {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <Folder className="h-5 w-5 text-pulse shrink-0" />
                    <div>
                      <h4 className="font-mono text-sm font-semibold text-text-primary flex items-center gap-2">
                        <span>folder / {folderName}</span>
                      </h4>
                      <p className="font-body text-xs text-text-muted">
                        Contains {items.length} isolated files/activities for this project only
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 font-mono text-xs font-semibold text-accent shadow-sm">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>

                    {isAdminOrEditor && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEventRepo(folderName);
                            setIsAddEventOpen(true);
                          }}
                          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1 font-body text-xs font-semibold text-canvas shadow hover:opacity-90 transition-opacity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add to {folderName}</span>
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete folder "${folderName}" and all its contents?`)) {
                              await deleteProjectMutation({ variables: { name: folderName } });
                              await refetchProjects();
                              await refetchActivity();
                            }
                          }}
                          title={`Delete ${folderName} folder`}
                          className="rounded-lg border border-canvas-line bg-canvas p-1.5 text-text-muted hover:border-danger hover:text-danger transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Folder Content Items (Strictly for this folder) */}
                {!isCollapsed && (
                  <div>
                    {items.length === 0 ? (
                      <div className="px-6 py-6 text-center font-body text-xs text-text-muted bg-canvas/20">
                        📁 This folder is empty. Click &quot;+ Add to {folderName}&quot; to insert files/activity into <strong className="text-text-primary">{folderName}</strong>.
                      </div>
                    ) : (
                      <ul className="divide-y divide-canvas-line">
                        {items.map((e) => {
                          const Icon = iconFor[e.type] ?? GitMerge;
                          return (
                            <li
                              key={e.id}
                              className="flex items-center justify-between gap-3 px-6 py-3 hover:bg-canvas/40 transition-colors"
                            >
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${colorFor[e.type] ?? "text-text-muted"}`} />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-body text-sm text-text-primary">
                                    <span className="font-medium text-text-primary">{e.actor}</span> {e.detail}
                                  </p>
                                  <div className="mt-0.5 flex items-center gap-2 font-mono text-xs text-text-muted">
                                    <span className="flex items-center gap-1 rounded bg-accent/20 border border-accent/40 px-2 py-0.5 text-accent font-mono text-xs font-semibold shadow-sm">
                                      <FileCode className="h-3 w-3" />
                                      {e.repo}
                                    </span>
                                    <span>· {getDynamicRelativeTime(e)}</span>
                                  </div>
                                </div>
                              </div>

                              {isAdminOrEditor && (
                                <div className="flex items-center gap-1.5 shrink-0 opacity-80 hover:opacity-100">
                                  <button
                                    onClick={() => {
                                      setEditingEvent(e);
                                      setEditDetail(e.detail);
                                      setEditType(e.type);
                                      setEditActor(e.actor);
                                      setEditRepo(e.repo);
                                      setIsEditEventOpen(true);
                                    }}
                                    title="Edit Activity"
                                    className="rounded p-1 text-text-muted hover:bg-canvas-line hover:text-accent transition-colors"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm("Are you sure you want to delete this activity event?")) {
                                        await deleteActivityEventMutation({ variables: { id: e.id } });
                                        await refetchActivity();
                                      }
                                    }}
                                    title="Delete Activity"
                                    className="rounded p-1 text-text-muted hover:bg-canvas-line hover:text-danger transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Modal 1: Add New Project Folder */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-canvas-line bg-canvas-raised p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-canvas-line pb-4">
              <div className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-pulse" />
                <h3 className="font-display text-lg font-semibold text-text-primary">Create Project Folder</h3>
              </div>
              <button
                onClick={() => setIsAddProjectOpen(false)}
                className="rounded-lg p-1 text-text-muted hover:text-text-primary hover:bg-canvas"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div>
                <label className="block font-body text-xs font-medium text-text-muted mb-1">
                  Folder / Project Name *
                </label>
                <input
                  required
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. neon, pulse-mobile, payment-service"
                  className="w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-pulse focus:ring-1 focus:ring-pulse"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-text-muted mb-1">
                  Folder Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Short description of this project folder..."
                  className="w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-pulse focus:ring-1 focus:ring-pulse"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="rounded-lg border border-canvas-line px-4 py-2 font-body text-sm font-medium text-text-muted hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-canvas shadow hover:opacity-90 transition-opacity"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Log New Event for a Project Folder */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-canvas-line bg-canvas-raised p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-canvas-line pb-4">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-pulse" />
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  Add File / Activity to Folder
                </h3>
              </div>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="rounded-lg p-1 text-text-muted hover:text-text-primary hover:bg-canvas"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="mt-4 space-y-4">
              <div>
                <label className="block font-body text-xs font-medium text-text-muted mb-1">
                  Target Folder / Project *
                </label>
                <CustomSelect
                  value={eventRepo}
                  onChange={(val) => setEventRepo(val)}
                  options={projectList.map((p) => ({
                    value: p,
                    label: `folder / ${p}`,
                    icon: Folder,
                  }))}
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-text-muted mb-1">
                  Event Type *
                </label>
                <CustomSelect
                  value={eventType}
                  onChange={(val) => setEventType(val)}
                  options={eventTypeOptions}
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-text-muted mb-1">
                  Actor Name (Person / System) *
                </label>
                <input
                  required
                  type="text"
                  value={eventActor}
                  onChange={(e) => setEventActor(e.target.value)}
                  placeholder="e.g. Priya N., Pipeline #501, or CI System"
                  className="w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-pulse"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-text-muted mb-1">
                  Activity Detail *
                </label>
                <input
                  required
                  type="text"
                  value={eventDetail}
                  onChange={(e) => setEventDetail(e.target.value)}
                  placeholder="e.g. Pipeline #501 or merged #482 into main"
                  className="w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-pulse"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="rounded-lg border border-canvas-line px-4 py-2 font-body text-sm font-medium text-text-muted hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-canvas shadow hover:opacity-90 transition-opacity"
                >
                  Insert into Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Edit Activity Event */}
      {isEditEventOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-canvas-line bg-canvas-raised p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-canvas-line pb-4">
              <div className="flex items-center gap-2">
                <Pencil className="h-5 w-5 text-accent" />
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  Edit Activity Item
                </h3>
              </div>
              <button
                onClick={() => setIsEditEventOpen(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateActivityEventMutation({
                  variables: {
                    id: editingEvent.id,
                    type: editType,
                    actor: editActor,
                    detail: editDetail,
                    repo: editRepo,
                  },
                });
                setIsEditEventOpen(false);
                setEditingEvent(null);
                await refetchActivity();
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block font-body text-xs font-medium text-text-muted mb-1">
                  Target Project Folder
                </label>
                <CustomSelect
                  value={editRepo}
                  onChange={(val) => setEditRepo(val)}
                  options={projectList.map((p) => ({
                    value: p,
                    label: `folder / ${p}`,
                    icon: Folder,
                  }))}
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-text-muted mb-1">
                  Event Type
                </label>
                <CustomSelect
                  value={editType}
                  onChange={(val) => setEditType(val)}
                  options={eventTypeOptions}
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-text-muted mb-1">
                  Actor Name
                </label>
                <input
                  required
                  type="text"
                  value={editActor}
                  onChange={(e) => setEditActor(e.target.value)}
                  className="w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-text-muted mb-1">
                  Activity Detail
                </label>
                <input
                  required
                  type="text"
                  value={editDetail}
                  onChange={(e) => setEditDetail(e.target.value)}
                  className="w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditEventOpen(false)}
                  className="rounded-lg border border-canvas-line px-4 py-2 font-body text-sm font-medium text-text-muted hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-medium text-canvas hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
