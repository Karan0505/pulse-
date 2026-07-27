import { NextResponse } from "next/server";
import { prisma } from "@/src/prisma/client";
import { blogPosts as fallbackMock } from "@/lib/graphql/mock-data";

export async function GET() {
  try {
    const dbBlogs = await prisma.blog.findMany({
      include: {
        author: {
          include: { role: true },
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbBlogs.length > 0) {
      // Strictly filter out any blogs authored by VIEWER users
      const authorizedBlogs = dbBlogs.filter((b) => {
        const roleName = b.author?.role?.name?.toUpperCase() || "";
        const authorName = `${b.author?.firstName || ""} ${b.author?.lastName || ""}`.toLowerCase();
        const authorEmail = (b.author?.email || "").toLowerCase();

        // Reject VIEWER role blogs
        if (roleName === "VIEWER" || authorName.includes("viewer") || authorEmail.includes("viewer")) {
          return false;
        }
        return true;
      });

      const mapped = authorizedBlogs.map((b) => ({
        id: b.id,
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt || b.content.slice(0, 120),
        author: b.author ? `${b.author.firstName} ${b.author.lastName}`.trim() || b.author.email : "Pulse Admin",
        date: b.createdAt.toISOString().split("T")[0],
        readMinutes: Math.max(2, Math.ceil(b.content.length / 400)),
        tag: b.category?.name || "Engineering",
        body: [b.content],
      }));

      const dbSlugs = new Set(mapped.map((m) => m.slug));
      const uniqueMock = fallbackMock.filter((m) => !dbSlugs.has(m.slug));
      return NextResponse.json([...mapped, ...uniqueMock]);
    }
  } catch (err) {
    console.error("API route Prisma blog query error:", err);
  }

  return NextResponse.json(fallbackMock);
}
