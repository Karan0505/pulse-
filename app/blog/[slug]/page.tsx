import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Section } from "@/components/ui/section";
import { blogPosts as fallbackPosts } from "@/lib/graphql/mock-data";
import { prisma } from "@/src/prisma/client";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

async function getBlogPost(slug: string) {
  try {
    const b = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          include: { role: true },
        },
        category: true,
      },
    });

    if (b) {
      const roleName = b.author?.role?.name?.toUpperCase() || "";
      const authorName = `${b.author?.firstName || ""} ${b.author?.lastName || ""}`.toLowerCase();
      const authorEmail = (b.author?.email || "").toLowerCase();

      // Reject VIEWER role blogs from being viewed/published
      if (roleName === "VIEWER" || authorName.includes("viewer") || authorEmail.includes("viewer")) {
        return null;
      }

      return {
        id: b.id,
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt || b.content.slice(0, 120),
        author: b.author ? `${b.author.firstName} ${b.author.lastName}`.trim() || b.author.email : "Pulse Admin",
        date: b.createdAt.toISOString().split("T")[0],
        readMinutes: Math.max(2, Math.ceil(b.content.length / 400)),
        tag: b.category?.name || "Engineering",
        body: [b.content],
      };
    }
  } catch (err) {
    console.error("Error fetching blog post by slug from Prisma:", err);
  }

  return fallbackPosts.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Pulse Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
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
            {post.body.map((para, i) => (
              <p key={i} className="font-body leading-relaxed text-text-primary/90">
                {para}
              </p>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}



function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
