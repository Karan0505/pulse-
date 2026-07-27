import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Section, Eyebrow } from "@/components/ui/section";
import { BlogList } from "@/components/marketing/blog-list";

export const metadata = {
  title: "Blog — Pulse",
  description: "Notes on engineering health, reviews, incidents and teams.",
};

export default function BlogIndexPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section className="pb-4 pt-20 md:pt-28">
          <Eyebrow>Blog</Eyebrow>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Notes on engineering health.
          </h1>
        </Section>
        <BlogList />
      </main>
      <Footer />
    </>
  );
}
