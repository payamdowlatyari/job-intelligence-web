import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";

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
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Job Intelligence. All rights reserved.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
