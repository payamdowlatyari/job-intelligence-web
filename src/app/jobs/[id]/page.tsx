"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import { fetchJob, updateJob, deleteJob } from "@/lib/api/jobs";
import { Spinner } from "@/components/Spinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const editJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  job_type: z.string().optional(),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  summary: z.string().optional(),
  description_clean: z.string().optional(),
});

type EditJobForm = z.infer<typeof editJobSchema>;

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm<EditJobForm>({
    resolver: zodResolver(editJobSchema),
    values: job
      ? {
          title: job.title,
          company: job.company,
          location: job.location,
          job_type: job.job_type ?? "",
          url: job.url ?? "",
          summary: job.summary ?? "",
          description_clean: job.description_clean ?? "",
        }
      : undefined,
  });

  const editMutation = useMutation({
    mutationFn: (data: EditJobForm) => {
      const payload = {
        ...data,
        url: data.url || undefined,
        job_type: data.job_type || undefined,
        summary: data.summary || undefined,
        description_clean: data.description_clean || undefined,
      };
      return updateJob(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      router.push("/jobs");
    },
  });

  function handleCancelEdit() {
    reset();
    setEditing(false);
  }

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

      {job && !editing && (
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

          <div className="flex flex-wrap gap-2">
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
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            {!confirmDelete ? (
              <Button
                variant="destructive"
                onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate()}>
                  {deleteMutation.isPending ? "Deleting…" : "Confirm Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {deleteMutation.isError && (
            <ErrorMessage
              message={
                (deleteMutation.error as Error)?.message ??
                "Failed to delete job."
              }
            />
          )}

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

      {job && editing && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Edit Job
          </h1>

          {editMutation.isError && (
            <ErrorMessage
              message={
                (editMutation.error as Error)?.message ??
                "Failed to update job."
              }
            />
          )}

          <form
            onSubmit={handleSubmit(data => editMutation.mutate(data))}
            className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...register("title")} />
              {formErrors.title && (
                <p className="text-sm text-destructive">
                  {formErrors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="company">Company *</Label>
                <Input id="company" {...register("company")} />
                {formErrors.company && (
                  <p className="text-sm text-destructive">
                    {formErrors.company.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" {...register("location")} />
                {formErrors.location && (
                  <p className="text-sm text-destructive">
                    {formErrors.location.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="job_type">Job Type</Label>
                <Input id="job_type" {...register("job_type")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="url">URL</Label>
                <Input id="url" {...register("url")} />
                {formErrors.url && (
                  <p className="text-sm text-destructive">
                    {formErrors.url.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" rows={3} {...register("summary")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description_clean">Description</Label>
              <Textarea
                id="description_clean"
                rows={8}
                {...register("description_clean")}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={editMutation.isPending}>
                {editMutation.isPending ? "Saving…" : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
