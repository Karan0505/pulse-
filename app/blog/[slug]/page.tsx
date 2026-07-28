import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { blogPosts as fallbackPosts } from "@/lib/graphql/mock-data";
import { prisma } from "@/src/prisma/client";
import { BlogPostView } from "@/components/marketing/blog-post-view";

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

  return fallbackPosts.find((p) => p.slug === slug || p.id === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return {
    title: post ? `${post.title} — Pulse Blog` : `Pulse Blog`,
    description: post?.excerpt || "Engineering posts and guides",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <BlogPostView slug={slug} initialPost={post} />
      </main>
      <Footer />
    </>
  );
}
