import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthGuard } from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Job Intelligence",
  description: "AI-powered job intelligence platform",
};

/**
 * The root layout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-background text-foreground"
        suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="flex-1">
            <AuthGuard>{children}</AuthGuard>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
