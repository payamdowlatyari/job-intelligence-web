import Link from "next/link";

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/apply", label: "Apply" },
  { href: "/jobs", label: "Jobs" },
  { href: "/match", label: "Match" },
  { href: "/cover-letter", label: "Cover Letter" },
];

const svgIcons = {
  github: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.599.111.82-.261.82-.577 0-.285-.011-1.04-.016-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 17.07 3.633 16.7 3.633 16.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495 .998 .108-.776 .418-1.305 .762-1.605 -2.665-.305 -5.467-1.332 -5.467-5.931 0 -1.31 .467 -2.381 1.235 -3.221 -.124-.303 -.535-1.524 .117-3.176 0 0 1.008-.322 3.301 1.23 .957-.266 1.983-.399 3.003-.404 1.02 .005 2.047 .138 3.006 .404 2.291-1.552 3.297-1.23 3.297-1.23 .653 1.653 .242 2.874 .119 3.176 .77 .84 1.233 1.911 1.233 3.221 0 4.609 -2.807 5.625 -5.479 5.921 .43 .372 .823 1.102 .823 2.222 0 1.606 -.015 2.898 -.015 3.293 0 .319 .218 .694 .825 .576A12.01 12.01 0 0024 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  linkedin: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75 1.75 .785 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.064-1.868-3.064-1.868 0-2.154 1.459-2.154 2.965v5.703h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.562 2.839-1.562 3.039 0 3.603 2 3.603 4.594v5.601z" />
    </svg>
  ),
  email: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4">
      <path d="M12 12.713l-11.99-7.713v13.999c0 1.104.896 2 1.999 2h19.982c1.103 0 1.999-.896 1.999-2v-13.999l-11.99 7.713zm11.99-9.713c0-.552-.448-1-1-1h-19.982c-.552 0-1 .448-1 1s.448 1 1 1h19.982c.552 0 1-.448 1-1z" />
    </svg>
  ),
};

const socialLinks = [
  {
    href: "mailto:pdowlatyari@gmail.com",
    icon: svgIcons.email,
    label: "Email",
  },
  {
    href: "https://www.linkedin.com/in/payamdowlatyari",
    icon: svgIcons.linkedin,
    label: "LinkedIn",
  },
  {
    href: "https://github.com/payamdowlatyari",
    icon: svgIcons.github,
    label: "GitHub",
  },
];

/**
 * Footer component containing page links, social links, and copyright information.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Page links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Pages
            </h3>
            <ul className="flex flex-row flex-wrap gap-2">
              {pageLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Connect
            </h3>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  {Icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Job Intelligence. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
