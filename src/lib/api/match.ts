import { apiFetch } from "./apiFetch";
import type { MatchRequest, MatchResult } from "../types";

/**
 * Matches jobs based on the provided resume text, skills, location, and company.
 * @param {MatchRequest} data - The data to match jobs with.
 * @returns {Promise<MatchResult[]>} - A promise that resolves with an array of matched jobs.
 */
export function matchJobs(data: MatchRequest): Promise<MatchResult[]> {
  return apiFetch<MatchResult[]>("/jobs/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
