import Link from "next/link";
import { Briefcase, Zap, FileText, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplyWorkflow } from "@/components/ApplyWorkflow";

const features = [
  {
    href: "/apply",
    icon: Link2,
    title: "Apply for Jobs",
    description:
      "Find and apply for job postings from top companies with just a few clicks.",
  },
  {
    href: "/jobs",
    icon: Briefcase,
    title: "Browse Jobs",
    description:
      "Search and filter thousands of job listings by keyword, company, location, and type.",
  },
  {
    href: "/match",
    icon: Zap,
    title: "Match Resume",
    description:
      "Paste your resume and get AI-ranked job matches with similarity scores.",
  },
  {
    href: "/cover-letter",
    icon: FileText,
    title: "Cover Letter",
    description:
      "Generate a tailored cover letter for any job by ID or URL in seconds.",
  },
];

/**
 * The Home component renders a landing page with a hero section and a feature grid.
 *
 * The hero section contains a heading, a description, and a call-to-action to get started.
 * The feature grid contains four cards, each with a title, description, and a call-to-action to learn more.
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Job Intelligence Platform
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered tools to find jobs, match your resume, and craft compelling
          cover letters — all in one place.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href} className="group block">
            <Card className="h-full transition-shadow group-hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Apply for a Job */}
      <div className="mt-14 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Apply for a Job
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste a job posting URL to parse it, then match your resume or
            generate a cover letter.
          </p>
        </div>
        <ApplyWorkflow />
      </div>
    </div>
  );
}
