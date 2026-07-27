import type { Metadata } from "next";
import "./globals.css";
import { ApolloWrapper } from "@/components/providers/apollo-wrapper";
import { AuthProvider } from "@/lib/auth-context";
import { InitialLoader } from "@/components/ui/initial-loader";

export const metadata: Metadata = {
  title: "Pulse — Know how your team is really doing",
  description:
    "Pulse gives engineering teams a live read on delivery health: activity, reviews, incidents and morale in one feed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body bg-canvas text-text-primary">
        <div className="grain-overlay" aria-hidden="true" />
        <ApolloWrapper>
          <AuthProvider>
            <InitialLoader />
            {children}
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
