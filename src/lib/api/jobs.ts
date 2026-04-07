import { apiFetch } from "./apiFetch";
import type { Job } from "../types";

export function fetchJobs(params: {
  keyword?: string;
  company?: string;
  location?: string;
  job_type?: string;
}): Promise<Job[]> {
  const query = new URLSearchParams();
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.company) query.set("company", params.company);
  if (params.location) query.set("location", params.location);
  if (params.job_type) query.set("job_type", params.job_type);

  const qs = query.toString();
  return apiFetch<Job[]>(`/jobs${qs ? `?${qs}` : ""}`);
}

export function fetchJob(id: string): Promise<Job> {
  return apiFetch<Job>(`/jobs/${id}`);
}
