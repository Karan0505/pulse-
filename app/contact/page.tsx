import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Section, Eyebrow } from "@/components/ui/section";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata = {
  title: "Contact — Pulse",
  description: "Talk to the Pulse team.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section className="grid gap-12 pt-20 md:grid-cols-2 md:pt-28">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Talk to the team.
            </h1>
            <p className="mt-5 max-w-sm font-body text-text-muted">
              Rolling Pulse out across more than one team, or want a tour
              before you connect a repo? Send a note and we&apos;ll reply
              within a business day.
            </p>
            <dl className="mt-10 space-y-4 font-body text-sm">
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-text-muted">Email</dt>
                <dd className="mt-1 text-text-primary">hello@pulse.dev</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-text-muted">Support</dt>
                <dd className="mt-1 text-text-primary">Typical reply time: under 4 hours</dd>
              </div>
            </dl>
          </div>
          <ContactForm />
        </Section>
      </main>
      <Footer />
    </>
  );
}
