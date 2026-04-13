"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createJob } from "@/lib/api/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/ErrorMessage";

const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  job_type: z.string().optional(),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description_clean: z.string().optional(),
  summary: z.string().optional(),
});

type CreateJobForm = z.infer<typeof createJobSchema>;

export default function NewJobPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateJobForm>({
    resolver: zodResolver(createJobSchema),
  });

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: job => {
      router.push(`/jobs/${job.id}`);
    },
  });

  function onSubmit(data: CreateJobForm) {
    const payload = {
      ...data,
      url: data.url || undefined,
      job_type: data.job_type || undefined,
      description_clean: data.description_clean || undefined,
      summary: data.summary || undefined,
    };
    mutation.mutate(payload);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-6">
        Create Job
      </h1>

      {mutation.isError && (
        <ErrorMessage
          message={
            (mutation.error as Error)?.message ?? "Failed to create job."
          }
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Software Engineer"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              {...register("company")}
            />
            {errors.company && (
              <p className="text-sm text-destructive">
                {errors.company.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="San Francisco, CA"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="job_type">Job Type</Label>
            <Input
              id="job_type"
              placeholder="Full-time"
              {...register("job_type")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="url">URL</Label>
            <Input id="url" placeholder="https://..." {...register("url")} />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            rows={3}
            placeholder="Brief summary…"
            {...register("summary")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description_clean">Description</Label>
          <Textarea
            id="description_clean"
            rows={8}
            placeholder="Full job description…"
            {...register("description_clean")}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating…" : "Create Job"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/jobs">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
