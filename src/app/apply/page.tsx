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
      <ApplyWorkflow />
    </div>
  );
}
