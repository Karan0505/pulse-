import { blogPosts as fallbackMock } from "@/lib/graphql/mock-data";

export type BlogPost = {
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

const STORAGE_KEY = "pulse_blog_posts";

export function getSavedBlogs(): BlogPost[] {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading blog registry:", e);
    }
  }
  return fallbackMock;
}

export function saveBlogs(posts: BlogPost[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      window.dispatchEvent(new Event("pulse_blogs_updated"));
    } catch (e) {
      console.error("Error saving blog registry:", e);
    }
  }
}

export function addBlogPost(newPost: BlogPost): BlogPost[] {
  const current = getSavedBlogs();
  const filtered = current.filter((p) => p.id !== newPost.id && p.slug !== newPost.slug);
  const updated = [newPost, ...filtered];
  saveBlogs(updated);
  return updated;
}

export function updateBlogPost(updatedPost: BlogPost): BlogPost[] {
  const current = getSavedBlogs();
  const updated = current.map((p) => (p.id === updatedPost.id ? updatedPost : p));
  saveBlogs(updated);
  return updated;
}

export function deleteBlogPost(id: string): BlogPost[] {
  const current = getSavedBlogs();
  const updated = current.filter((p) => p.id !== id);
  saveBlogs(updated);
  return updated;
}
