"use client";

import { ApplyWorkflow } from "@/components/ApplyWorkflow";

/**
 * A page that allows users to apply to a job by pasting a job posting URL.
 * The page renders a form to input the job posting URL, then renders the
 * ApplyWorkflow component to match the user's resume or generate a cover letter.
 */
export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Apply to a Job
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste a job posting URL to parse it, then match your resume or
          generate a cover letter.
        </p>
      </div>

      <ApplyWorkflow />
    </div>
  );
}
