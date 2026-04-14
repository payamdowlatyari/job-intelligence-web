"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Link2,
  Building2,
  MapPin,
  Briefcase,
  Zap,
  FileText,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { ingestJobFromUrl } from "@/lib/api/ingest";
import { matchJobs } from "@/lib/api/match";
import { generateCoverLetter } from "@/lib/api/coverLetter";
import type { Job, MatchResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/Spinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ResumeInput } from "@/components/ResumeInput";
import { useSession } from "next-auth/react";

const urlSchema = z.object({
  job_url: z.string().url("Must be a valid URL"),
});

type UrlFormValues = z.infer<typeof urlSchema>;

const TONES = ["professional", "casual", "enthusiastic"] as const;
const LENGTHS = ["short", "medium", "long"] as const;

/* ------------------------------------------------------------------ */
/*  URL input                                                         */
/* ------------------------------------------------------------------ */

/**
 * A step in the apply workflow that fetches a job from a given URL.
 * It renders a form with a single input field for the job posting URL.
 * When the form is submitted, it calls the `ingestJobFromUrl` mutation function to ingest the job.
 * If the mutation is successful, it calls the `onJobIngested` callback with the ingested job.
 * If the mutation is an error, it renders an error message.
 */
function UrlStep({ onJobIngested }: { onJobIngested: (job: Job) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: UrlFormValues) => ingestJobFromUrl(data.job_url),
    onSuccess: res => {
      if (res.jobs.length > 0) {
        onJobIngested(res.jobs[0]);
      } else if (res.failures.length > 0) {
        throw new Error(res.failures[0].error);
      }
    },
  });

  return (
    <form
      onSubmit={handleSubmit(data => mutation.mutate(data))}
      className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="job_url">Job Posting URL</Label>
        <div className="flex gap-2">
          <Input
            id="job_url"
            type="url"
            placeholder="https://example.com/jobs/123"
            className="flex-1"
            {...register("job_url")}
          />
          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            {mutation.isPending ? "Loading…" : "Fetch Job"}
          </Button>
        </div>
        {errors.job_url && (
          <p className="text-xs text-destructive">{errors.job_url.message}</p>
        )}
      </div>

      {mutation.isError && (
        <ErrorMessage
          message={
            (mutation.error as Error)?.message ??
            "Failed to fetch job from URL."
          }
        />
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Job preview                                                       */
/* ------------------------------------------------------------------ */

/**
 * A card component that displays a job preview.
 * @param {job: Job} - The job to display.
 */
function JobPreview({ job }: { job: Job }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{job.title}</CardTitle>
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
        </div>
      </CardHeader>
      {(job.summary || job.description_clean) && (
        <CardContent className="space-y-3">
          {job.summary && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {job.summary}
            </p>
          )}
          {job.description_clean && (
            <div className="max-h-48 overflow-y-auto rounded-md border border-border bg-muted/30 p-3">
              <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground font-sans">
                {job.description_clean}
              </pre>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Match Resume panel                                                */
/* ------------------------------------------------------------------ */

/**
 * A component that matches a resume with job openings.
 *
 * The component contains a ResumeInput field and a button to trigger the match.
 * When the match is pending, it displays a spinner. If the match is an error, it displays an error message.
 * If the match is successful, it displays the matches found.
 */
function MatchPanel({ job }: { job: Job }) {
  const [resumeText, setResumeText] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      matchJobs({ resume_text: resumeText, company: job.company }),
  });

  return (
    <div className="space-y-4">
      <ResumeInput
        id="match_resume"
        value={resumeText}
        onChange={setResumeText}
      />

      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || resumeText.length < 50}
        className="gap-2">
        <Zap className="h-4 w-4" />
        {mutation.isPending ? "Matching…" : "Match Resume"}
      </Button>

      {mutation.isPending && <Spinner />}
      {mutation.isError && (
        <ErrorMessage
          message={
            (mutation.error as Error)?.message ?? "Matching failed. Try again."
          }
        />
      )}

      {mutation.isSuccess && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">
            {mutation.data.matches.length} Matches Found
            <span className="text-xs font-normal text-muted-foreground ml-2">
              ({mutation.data.total_candidates} candidates searched)
            </span>
          </h3>
          {mutation.data.matches.map((result: MatchResult, idx: number) => (
            <Card key={result.job.id} className="flex items-center">
              <CardHeader className="py-3 pr-0 w-14 shrink-0">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {Math.round(result.similarity_score * 100)}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 py-3">
                <p className="text-sm font-semibold">{result.job.title}</p>
                <p className="text-xs text-muted-foreground">
                  {result.job.company} · {result.job.location}
                </p>
                {result.match_reason && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.match_reason}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cover Letter panel                                                */
/* ------------------------------------------------------------------ */

/**
 * A component that generates a cover letter based on a job posting.
 *
 * The component takes a job object as a prop and renders a form with fields for the job ID, resume text, tone, and length.
 * When the form is submitted, it calls the `generateCoverLetter` mutation function to generate a cover letter.
 *
 * If the mutation is pending, it displays a spinner. If the mutation is an error, it displays an error message.
 * If the mutation is successful, it displays the generated cover letter.
 */
function CoverLetterPanel({ job }: { job: Job }) {
  const [resumeText, setResumeText] = useState("");
  const [tone, setTone] = useState<string>("professional");
  const [length, setLength] = useState<string>("medium");
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      generateCoverLetter({
        job_id: job.id,
        resume_text: resumeText,
        tone,
        length,
      }),
  });

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <ResumeInput id="cl_resume" value={resumeText} onChange={setResumeText} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map(t => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Length</Label>
          <Select value={length} onValueChange={setLength}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LENGTHS.map(l => (
                <SelectItem key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || resumeText.length < 50}
        className="gap-2">
        <FileText className="h-4 w-4" />
        {mutation.isPending ? "Generating…" : "Generate Cover Letter"}
      </Button>

      {mutation.isPending && <Spinner />}
      {mutation.isError && (
        <ErrorMessage
          message={
            (mutation.error as Error)?.message ??
            "Failed to generate cover letter."
          }
        />
      )}

      {mutation.isSuccess && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generated Cover Letter
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(mutation.data.cover_letter)}
              className="gap-1.5">
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </Button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto rounded-md border border-border bg-muted/30 p-4">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
              {mutation.data.cover_letter}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main exported component                                           */
/* ------------------------------------------------------------------ */

type ActivePanel = "match" | "cover-letter" | null;

/**
 * A component that allows users to apply to a job by pasting a job posting URL.
 * The component renders a form to input the job posting URL, then renders the
 * ApplyWorkflow component to match the user's resume or generate a cover letter.
 */
export function ApplyWorkflow() {
  const [job, setJob] = useState<Job | null>(null);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          <span>Loading your session...</span>
        </div>
      </div>
    );
  }

  // If the user is not signed in, show a message.
  // Create an opportunity to show the benefits of signing in, such as saving resumes and cover letters, tracking applications, etc.
  if (status === "unauthenticated") {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">
          Welcome to the Job Intelligence Platform
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Sign in to access personalized job matching, cover letter generation,
          and application tracking.
        </p>
        <Button asChild>
          <a href="/sign-in" className="gap-2">
            <Zap className="h-4 w-4" />
            Get Started
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
        Apply for a Job
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Paste a job posting URL to parse it, then match your resume or generate
        a cover letter.
      </p>
      <div className="space-y-6">
        <UrlStep
          onJobIngested={ingestedJob => {
            setJob(ingestedJob);
            setActivePanel(null);
          }}
        />

        {job && (
          <>
            <Separator />
            <JobPreview job={job} />

            <div className="flex gap-3">
              <Button
                variant={activePanel === "match" ? "default" : "outline"}
                onClick={() =>
                  setActivePanel(activePanel === "match" ? null : "match")
                }
                className="gap-2">
                <Zap className="h-4 w-4" />
                Match Resume
              </Button>
              <Button
                variant={activePanel === "cover-letter" ? "default" : "outline"}
                onClick={() =>
                  setActivePanel(
                    activePanel === "cover-letter" ? null : "cover-letter",
                  )
                }
                className="gap-2">
                <FileText className="h-4 w-4" />
                Generate Cover Letter
              </Button>
            </div>

            {activePanel === "match" && (
              <>
                <Separator />
                <MatchPanel job={job} />
              </>
            )}
            {activePanel === "cover-letter" && (
              <>
                <Separator />
                <CoverLetterPanel job={job} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
