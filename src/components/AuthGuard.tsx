"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Spinner } from "@/components/Spinner";

const PUBLIC_PATHS = ["/", "/sign-in"];

/**
 * AuthGuard component that prevents unauthorized access to pages.
 *
 * If the page is public and the user is not authenticated, it will
 * redirect the user to the sign-in page.
 * If the page is public and the user is authenticated, it will
 * redirect the user to the sign-in page with the current pathname as a query parameter.
 * If the page is not public, it will render nothing.
 * If the user is authenticated and the page is not public, it will render the passed children.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublic) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, isPublic, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated && !isPublic) {
    return null;
  }

  return <>{children}</>;
}
