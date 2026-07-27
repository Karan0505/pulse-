"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { GET_BLOG_POSTS } from "@/lib/graphql/queries";
import { Section } from "@/components/ui/section";
import { ArrowUpRight } from "lucide-react";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readMinutes: number;
  tag: string;
};

export function BlogList() {
  const { data, loading } = useQuery<{ blogPosts: Post[] }>(GET_BLOG_POSTS);

  return (
    <Section className="pt-4">
      <div className="divide-y divide-canvas-line border-t border-canvas-line">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse py-8" />
          ))}
        {data?.blogPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-3 py-8 md:flex-row md:items-center md:justify-between md:gap-8"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-text-muted">
                <span className="text-accent">{post.tag}</span>
                <span>{formatDate(post.date)}</span>
                <span>{post.readMinutes} min read</span>
              </div>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-2 max-w-xl font-body text-sm text-text-muted">{post.excerpt}</p>
              <p className="mt-2 font-mono text-xs text-text-muted">by {post.author}</p>
            </div>
            <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-accent md:block" />
          </Link>
        ))}
      </div>
    </Section>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
