import { apiFetch } from "./apiFetch";
import type { Job } from "../types";

/**
 * Fetches a list of jobs from the API, filtered by the given parameters.
 *
 * @param {Object} params - An object containing the following properties:
 *   - keyword: A string to search for in the job title and description.
 *   - company: A string to search for in the company name.
 *   - location: A string to search for in the job location.
 *   - job_type: A string to search for in the job type.
 *
 * @returns {Promise<Job[]>} A promise that resolves to an array of Job objects.
 */
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

/**
 * Fetches a job by ID from the API.
 */
export function fetchJob(id: string): Promise<Job> {
  return apiFetch<Job>(`/jobs/${id}`);
}
