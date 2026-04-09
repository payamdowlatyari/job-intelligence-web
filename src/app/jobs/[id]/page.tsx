"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  FileText,
} from "lucide-react";
import { fetchJob } from "@/lib/api/jobs";
import { Spinner } from "@/components/Spinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * A page that displays a job by ID.
 *
 * @param {JobDetailPageProps} props - Props for the page component.
 */
export default function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = use(params);

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJob(id),
    enabled: !!id,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      {isLoading && <Spinner />}
      {isError && (
        <ErrorMessage
          message={(error as Error)?.message ?? "Failed to load job."}
        />
      )}

      {job && (
        <article className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              {job.job_type && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {job.job_type}
                </Badge>
              )}
              {job.posted_date && (
                <span className="text-xs text-muted-foreground">
                  Posted: {job.posted_date}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/cover-letter?job_id=${job.id}`}>
                <FileText className="h-4 w-4" />
                Generate Cover Letter
              </Link>
            </Button>
            {job.url && (
              <Button variant="outline" asChild>
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  View Original
                </a>
              </Button>
            )}
          </div>

          <Separator />

          {job.summary && (
            <section className="space-y-2">
              <h2 className="text-base font-semibold">Summary</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {job.summary}
              </p>
            </section>
          )}

          {job.description_clean && (
            <section className="space-y-2">
              <h2 className="text-base font-semibold">Description</h2>
              <div className="max-h-[60vh] overflow-y-auto rounded-md border border-border bg-muted/30 p-4">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-sans">
                  {job.description_clean}
                </pre>
              </div>
            </section>
          )}
        </article>
      )}
    </div>
  );
}
