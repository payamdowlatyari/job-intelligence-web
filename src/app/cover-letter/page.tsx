"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Copy, Check, FileText } from "lucide-react";
import {
  generateCoverLetter,
  generateCoverLetterFromUrl,
} from "@/lib/api/coverLetter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const TONES = ["professional", "casual", "enthusiastic"] as const;
const LENGTHS = ["short", "medium", "long"] as const;

const jobIdSchema = z.object({
  job_id: z.string().min(1, "Job ID is required"),
  resume_text: z.string().min(50, "Resume must be at least 50 characters"),
  tone: z.enum(TONES),
  length: z.enum(LENGTHS),
});

const jobUrlSchema = z.object({
  job_url: z.string().url("Must be a valid URL"),
  resume_text: z.string().min(50, "Resume must be at least 50 characters"),
  tone: z.enum(TONES),
  length: z.enum(LENGTHS),
});

type JobIdFormValues = z.infer<typeof jobIdSchema>;
type JobUrlFormValues = z.infer<typeof jobUrlSchema>;

/**
 * A component that displays a generated cover letter and allows the user to copy it.
 * @param {{ text: string }} - The generated cover letter text.
 */
function CoverLetterResult({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  /**
   * Copies the generated cover letter to the user's clipboard.
   * Sets the `copied` state to true for 2 seconds after copying.
   */
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generated Cover Letter
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
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
          {text}
        </pre>
      </div>
    </div>
  );
}

/**
 * A function that takes a tone value and a length value and returns a component that displays a dropdown for each.
 * @param {toneValue} - The tone value.
 * @param {lengthValue} - The length value.
 * @param {onToneChange} - A function that is called when the tone value changes.
 * @param {onLengthChange} - A function that is called when the length value changes.
 */
function ToneAndLength({
  toneValue,
  lengthValue,
  onToneChange,
  onLengthChange,
}: {
  toneValue: string;
  lengthValue: string;
  onToneChange: (v: string) => void;
  onLengthChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>Tone</Label>
        <Select value={toneValue} onValueChange={onToneChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select tone" />
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
        <Select value={lengthValue} onValueChange={onLengthChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select length" />
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
  );
}

/**
 * A form component that allows users to generate a cover letter based on a job ID.
 * @param {{ defaultJobId: string }} props - The props object.
 * @param {string} props.defaultJobId - The default job ID to generate a cover letter for.
 */
function FromJobIdTab({ defaultJobId }: { defaultJobId: string }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobIdFormValues>({
    resolver: zodResolver(jobIdSchema),
    defaultValues: {
      job_id: defaultJobId,
      tone: "professional",
      length: "medium",
    },
  });

  const tone = watch("tone");
  const length = watch("length");
  const resumeText = watch("resume_text") ?? "";

  const mutation = useMutation({ mutationFn: generateCoverLetter });

  function onSubmit(data: JobIdFormValues) {
    mutation.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="space-y-1.5">
        <Label htmlFor="job_id">Job ID *</Label>
        <Input id="job_id" placeholder="e.g. abc123" {...register("job_id")} />
        {errors.job_id && (
          <p className="text-xs text-destructive">{errors.job_id.message}</p>
        )}
      </div>

      <ResumeInput
        id="resume_text_id"
        value={resumeText}
        onChange={text =>
          setValue("resume_text", text, { shouldValidate: true })
        }
        error={errors.resume_text?.message}
      />

      <ToneAndLength
        toneValue={tone}
        lengthValue={length}
        onToneChange={v => setValue("tone", v as (typeof TONES)[number])}
        onLengthChange={v => setValue("length", v as (typeof LENGTHS)[number])}
      />

      <Button type="submit" disabled={mutation.isPending} className="gap-2">
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
        <CoverLetterResult text={mutation.data.cover_letter} />
      )}
    </form>
  );
}

/**
 * A component that generates a cover letter based on a job URL.
 *
 * The component contains a form with fields for the job URL, resume text, tone, and length.
 * When the form is submitted, it calls the `generateCoverLetterFromUrl` mutation function to generate a cover letter.
 *
 * If the mutation is pending, it displays a spinner. If the mutation is an error, it displays an error message.
 * If the mutation is successful, it displays the generated cover letter.
 */
function FromUrlTab() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobUrlFormValues>({
    resolver: zodResolver(jobUrlSchema),
    defaultValues: {
      tone: "professional",
      length: "medium",
    },
  });

  const tone = watch("tone");
  const length = watch("length");
  const resumeText = watch("resume_text") ?? "";

  const mutation = useMutation({ mutationFn: generateCoverLetterFromUrl });

  function onSubmit(data: JobUrlFormValues) {
    mutation.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="space-y-1.5">
        <Label htmlFor="job_url">Job URL *</Label>
        <Input
          id="job_url"
          type="url"
          placeholder="https://example.com/jobs/123"
          {...register("job_url")}
        />
        {errors.job_url && (
          <p className="text-xs text-destructive">{errors.job_url.message}</p>
        )}
      </div>

      <ResumeInput
        id="resume_text_url"
        value={resumeText}
        onChange={text =>
          setValue("resume_text", text, { shouldValidate: true })
        }
        error={errors.resume_text?.message}
      />

      <ToneAndLength
        toneValue={tone}
        lengthValue={length}
        onToneChange={v => setValue("tone", v as (typeof TONES)[number])}
        onLengthChange={v => setValue("length", v as (typeof LENGTHS)[number])}
      />

      <Button type="submit" disabled={mutation.isPending} className="gap-2">
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
        <CoverLetterResult text={mutation.data.cover_letter} />
      )}
    </form>
  );
}

/**
 * A component that renders the cover letter generator page content.
 *
 * The component takes a search parameter "job_id" as an optional default job ID.
 * It renders a tabbed interface with two tabs: "From Job ID" and "From URL".
 * The "From Job ID" tab renders a form to generate a cover letter from a job ID.
 * The "From URL" tab renders a form to generate a cover letter from a job posting URL.
 */
function CoverLetterPageContent() {
  const searchParams = useSearchParams();
  const defaultJobId = searchParams.get("job_id") ?? "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
        Cover Letter Generator
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Generate a tailored cover letter from a job ID or a job posting URL.
      </p>

      <Tabs defaultValue={defaultJobId ? "id" : "url"}>
        <TabsList>
          <TabsTrigger value="id">From Job ID</TabsTrigger>
          <TabsTrigger value="url">From URL</TabsTrigger>
        </TabsList>

        <TabsContent value="id">
          <FromJobIdTab defaultJobId={defaultJobId} />
        </TabsContent>

        <TabsContent value="url">
          <FromUrlTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * A page that renders a cover letter generator.
 * The page renders a tabbed interface with two tabs: "From Job ID" and "From URL".
 * The "From Job ID" tab renders a form to generate a cover letter from a job ID.
 * The "From URL" tab renders a form to generate a cover letter from a job posting URL.
 * The page takes a search parameter "job_id" as an optional default job ID.
 */
export default function CoverLetterPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CoverLetterPageContent />
    </Suspense>
  );
}
