"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Briefcase, LogOut, LogIn, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/apply", label: "Apply" },
  { href: "/jobs", label: "Jobs" },
  { href: "/match", label: "Match" },
  { href: "/cover-letter", label: "Cover Letter" },
];

/**
 * Header component for the app.
 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/sign-in");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground">
          <Briefcase className="h-5 w-5 text-primary" />
          <span>Job Intelligence</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isLoading ? null : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.name ?? user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-xs">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link href="/sign-in">
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </Link>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav">
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
