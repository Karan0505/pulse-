"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { Plus, Edit, Trash2, Shield, Edit3, Eye, FileText, X } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";
import { GET_BLOG_POSTS } from "@/lib/graphql/queries";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readMinutes: number;
  tag: string;
  body: string[];
};

export function BlogsManagement() {
  const { session } = useAuth();
  
  // Live GraphQL polling every 3 seconds from Prisma database
  const { data: gqlData } = useQuery<{ blogPosts: BlogPost[] }>(GET_BLOG_POSTS, {
    pollInterval: 3000,
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);

  // Sync state whenever GraphQL data updates from Prisma DB
  useEffect(() => {
    if (gqlData?.blogPosts) {
      setPosts(gqlData.blogPosts);
    }
  }, [gqlData]);

  // Role detection
  const userEmail = session?.email?.toLowerCase() ?? "";
  const isAdmin = userEmail.includes("admin");
  const isEditor = userEmail.includes("editor");
  const isViewer = !isAdmin && !isEditor; // Default for regular users is VIEWER (Read-only)

  const canManageBlogs = isAdmin || isEditor; // Both Admin and Editor can create/edit/delete blogs
  const currentRoleLabel = isAdmin ? "ADMIN" : isEditor ? "EDITOR" : "VIEWER";

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSavePost = (data: { title: string; tag: string; excerpt: string; body: string }) => {
    if (editPost) {
      // Update
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editPost.id
            ? {
                ...p,
                title: data.title || p.title,
                excerpt: data.excerpt || p.excerpt,
                tag: data.tag || p.tag,
                body: [data.body || p.body[0] || ""],
              }
            : p
        )
      );
      setEditPost(null);
    } else {
      // Create
      const created: BlogPost = {
        id: `b-${Date.now()}`,
        slug: (data.title || "new-post").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: data.title || "Untitled Post",
        excerpt: data.excerpt || "New post description...",
        author: session?.email.split("@")[0] ?? "Author",
        date: new Date().toISOString().split("T")[0],
        readMinutes: 4,
        tag: data.tag || "Engineering",
        body: [data.body || "Blog content..."],
      };
      setPosts((prev) => [created, ...prev]);
      setCreateOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Badge Bar */}
      <div className="flex items-center justify-between rounded-xl border border-canvas-line bg-canvas-raised px-6 py-3">
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span>Active Role:</span>
          <span
            className={clsx(
              "flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold tracking-wider",
              isAdmin && "bg-accent/20 text-accent border border-accent/40",
              isEditor && "bg-pulse/20 text-pulse border border-pulse/40",
              isViewer && "bg-canvas-line text-text-muted border border-text-muted/30"
            )}
          >
            {isAdmin && <Shield className="h-3 w-3" />}
            {isEditor && <Edit3 className="h-3 w-3" />}
            {isViewer && <Eye className="h-3 w-3" />}
            {currentRoleLabel}
          </span>
        </div>
        {canManageBlogs ? (
          <span className="font-mono text-xs text-pulse">
            ✅ You have permission to Create, Edit & Delete blogs.
          </span>
        ) : (
          <span className="font-mono text-xs text-text-muted italic">
            🔒 Read-only mode (Blog creation and editing is restricted to Admin & Editor)
          </span>
        )}
      </div>

      {/* Header with Create Button for Admin & Editor */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Blog Management</h1>
          <p className="mt-1 font-body text-sm text-text-muted">
            Manage engineering posts, guides, and articles.
          </p>
        </div>

        {canManageBlogs && (
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 font-body text-sm font-medium text-canvas transition-opacity hover:opacity-90 shadow-md"
          >
            <Plus className="h-4 w-4" /> Create Blog Post
          </button>
        )}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col justify-between rounded-2xl border border-canvas-line bg-canvas-raised p-6 transition-all hover:border-canvas-line/80"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-mono text-xs font-medium text-accent">
                  {post.tag}
                </span>
                <span className="font-mono text-xs text-text-muted">{post.date}</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-text-primary">
                {post.title}
              </h3>
              <p className="mt-2 font-body text-sm text-text-muted line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-canvas-line/60 pt-4">
              <span className="font-mono text-xs text-text-muted">By {post.author}</span>

              {/* Edit & Delete Action Buttons for Admin & Editor Only */}
              {canManageBlogs ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditPost(post)}
                    className="flex items-center gap-1 rounded-lg border border-canvas-line bg-canvas px-3 py-1.5 font-body text-xs font-medium text-text-primary hover:border-accent hover:text-accent transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex items-center gap-1 rounded-lg border border-canvas-line bg-canvas px-3 py-1.5 font-body text-xs font-medium text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              ) : (
                <span className="font-mono text-xs text-text-muted flex items-center gap-1">
                  <Eye className="h-3 w-3" /> Read Only
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {(createOpen || editPost) && (
        <BlogModal
          post={editPost}
          onClose={() => {
            setCreateOpen(false);
            setEditPost(null);
          }}
          onSave={handleSavePost}
        />
      )}
    </div>
  );
}

function BlogModal({
  post,
  onClose,
  onSave,
}: {
  post: BlogPost | null;
  onClose: () => void;
  onSave: (data: { title: string; tag: string; excerpt: string; body: string }) => void;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [tag, setTag] = useState(post?.tag ?? "Engineering");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body?.[0] ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-canvas-line bg-canvas-raised p-6">
        <div className="flex items-center justify-between border-b border-canvas-line pb-4">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            {post ? "Edit Blog Post" : "Create New Blog Post"}
          </h3>
          <button onClick={onClose} aria-label="Close" className="text-text-muted hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-text-muted">
              Blog Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Measuring Review Latency in Enterprise Teams"
              className="mt-1.5 w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-text-muted">
              Category / Tag
            </label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none"
            >
              <option value="Engineering">Engineering</option>
              <option value="Reliability">Reliability</option>
              <option value="Management">Management</option>
              <option value="Product">Product</option>
              <option value="Architecture">Architecture</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-text-muted">
              Short Excerpt / Summary
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary displayed on cards..."
              className="mt-1.5 w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent resize-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-text-muted">
              Post Content
            </label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your blog post content here..."
              className="mt-1.5 w-full rounded-lg border border-canvas-line bg-canvas px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-canvas-line pt-4">
          <button
            onClick={onClose}
            className="rounded-full border border-canvas-line px-4 py-2 font-body text-sm font-medium text-text-muted hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            disabled={!title.trim()}
            onClick={() => onSave({ title, tag, excerpt, body })}
            className="rounded-full bg-accent px-5 py-2 font-body text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {post ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
