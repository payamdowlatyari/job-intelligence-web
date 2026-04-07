import Link from "next/link";
import { Briefcase, Zap, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
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

      <div className="grid gap-6 sm:grid-cols-3">
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
    </div>
  );
}
