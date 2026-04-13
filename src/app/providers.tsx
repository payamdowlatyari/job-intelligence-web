"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { ResumeProvider } from "@/lib/resume-context";

/**
 * A component that wraps the application with NextAuth's SessionProvider, TanStack's QueryClientProvider, and the ResumeProvider.
 * This component is required for the application to function correctly.
 * It provides the necessary context for authentication, caching, and resume text management.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ResumeProvider>{children}</ResumeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
