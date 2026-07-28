"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { getSavedBlogs, BlogPost } from "@/lib/blog-registry";

export function BlogPostView({
  slug,
  initialPost,
}: {
  slug: string;
  initialPost: BlogPost | null;
}) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [loading, setLoading] = useState(!initialPost);

  useEffect(() => {
    if (!post) {
      const saved = getSavedBlogs();
      const found = saved.find(
        (p) => p.slug === slug || p.id === slug || p.slug.toLowerCase() === slug.toLowerCase()
      );
      if (found) {
        setPost(found);
      }
      setLoading(false);
    }
  }, [slug, post]);

  if (loading) {
    return (
      <Section className="max-w-3xl pb-4 pt-20 md:pt-28">
        <div className="h-40 animate-pulse rounded-2xl bg-canvas-line/30" />
      </Section>
    );
  }

  if (!post) {
    return (
      <Section className="max-w-3xl pb-4 pt-20 text-center md:pt-28">
        <h1 className="font-display text-2xl font-semibold">Post Not Found</h1>
        <p className="mt-2 font-body text-sm text-text-muted">
          The requested blog post could not be found.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-body text-sm font-medium text-canvas"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all posts
        </Link>
      </Section>
    );
  }

  return (
    <Section className="max-w-3xl pb-4 pt-20 md:pt-28">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All posts
      </Link>

      <div className="mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-text-muted">
        <span className="text-accent">{post.tag}</span>
        <span>{formatDate(post.date)}</span>
        <span>{post.readMinutes} min read</span>
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 font-mono text-xs text-text-muted">by {post.author}</p>

      <div className="mt-10 space-y-6 border-t border-canvas-line pt-10">
        {post.body && post.body.length > 0 ? (
          post.body.map((para, i) => (
            <p key={i} className="font-body leading-relaxed text-text-primary/90">
              {para}
            </p>
          ))
        ) : (
          <p className="font-body leading-relaxed text-text-primary/90">
            {post.excerpt}
          </p>
        )}
      </div>
    </Section>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
