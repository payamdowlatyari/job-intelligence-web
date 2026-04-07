import { apiFetch } from "./apiFetch";
import type { MatchRequest, MatchResult } from "../types";

export function matchJobs(data: MatchRequest): Promise<MatchResult[]> {
  return apiFetch<MatchResult[]>("/jobs/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
