"use client";

import { ApplyWorkflow } from "@/components/ApplyWorkflow";

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
