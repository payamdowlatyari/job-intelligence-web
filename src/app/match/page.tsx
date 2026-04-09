"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Zap, ExternalLink } from "lucide-react";
import { matchJobs } from "@/lib/api/match";
import type { MatchResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/Spinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { EmptyState } from "@/components/EmptyState";
import { ResumeInput } from "@/components/ResumeInput";

const matchSchema = z.object({
  resume_text: z.string().min(50, "Resume must be at least 50 characters"),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  company: z.string().optional(),
});

type MatchFormValues = z.infer<typeof matchSchema>;

export default function MatchPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
  });

  const resumeText = watch("resume_text") ?? "";

  const mutation = useMutation({
    mutationFn: matchJobs,
  });

  function onSubmit(data: MatchFormValues) {
    mutation.mutate(data);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
        Resume Match
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Paste your resume and get AI-ranked job matches with similarity scores.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <ResumeInput
          id="resume_text"
          value={resumeText}
          onChange={text =>
            setValue("resume_text", text, { shouldValidate: true })
          }
          error={errors.resume_text?.message}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="skills">Skills (optional)</Label>
            <Input
              id="skills"
              placeholder="React, Python, SQL…"
              onChange={e => {
                const value = e.target.value;
                setValue(
                  "skills",
                  value
                    ? value
                        .split(",")
                        .map(s => s.trim())
                        .filter(Boolean)
                    : undefined,
                );
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              placeholder="Remote, New York…"
              {...register("location")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">Company (optional)</Label>
            <Input
              id="company"
              placeholder="Google, Stripe…"
              {...register("company")}
            />
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending} className="gap-2">
          <Zap className="h-4 w-4" />
          {mutation.isPending ? "Matching…" : "Match Jobs"}
        </Button>
      </form>

      {mutation.isPending && <Spinner />}
      {mutation.isError && (
        <ErrorMessage
          message={
            (mutation.error as Error)?.message ?? "Matching failed. Try again."
          }
        />
      )}

      {mutation.isSuccess && mutation.data.matches.length === 0 && (
        <EmptyState message="No matching jobs found. Try updating your resume or filters." />
      )}

      {mutation.isSuccess && mutation.data.matches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {mutation.data.matches.length} Matches Found
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({mutation.data.total_candidates} candidates searched)
            </span>
          </h2>
          <div className="space-y-3">
            {mutation.data.matches.map((result: MatchResult, idx: number) => (
              <Card key={result.job.id} className="flex items-center">
                <CardHeader className="py-4 pr-0 w-14 shrink-0">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {Math.round(result.similarity_score * 100)}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 py-4">
                  <CardTitle className="text-sm font-semibold mb-1">
                    {result.job.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {result.job.company} · {result.job.location}
                  </p>
                  {result.match_reason && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.match_reason}
                    </p>
                  )}
                  {result.job.job_type && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {result.job.job_type}
                    </Badge>
                  )}
                </CardContent>
                <div className="pr-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/jobs/${result.job.id}`}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View job</span>
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
