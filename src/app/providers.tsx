"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { ResumeProvider } from "@/lib/resume-context";

/**
 * A component that wraps the application with AuthProvider, TanStack's QueryClientProvider, and the ResumeProvider.
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
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ResumeProvider>{children}</ResumeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
