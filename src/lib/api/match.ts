import { apiFetch } from "./apiFetch";
import type { MatchRequest, MatchResponse } from "../types";

/**
 * Matches jobs based on the provided resume text, skills, location, and company.
 * @param {MatchRequest} data - The data to match jobs with.
 * @returns {Promise<MatchResponse>} - A promise that resolves with the match response.
 */
export function matchJobs(data: MatchRequest): Promise<MatchResponse> {
  return apiFetch<MatchResponse>("/jobs/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
