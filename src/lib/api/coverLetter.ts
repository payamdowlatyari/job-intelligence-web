import { apiFetch } from "./apiFetch";
import type {
  CoverLetterRequest,
  CoverLetterFromUrlRequest,
  CoverLetterResponse,
} from "../types";

export function generateCoverLetter(
  data: CoverLetterRequest
): Promise<CoverLetterResponse> {
  return apiFetch<CoverLetterResponse>("/jobs/cover-letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function generateCoverLetterFromUrl(
  data: CoverLetterFromUrlRequest
): Promise<CoverLetterResponse> {
  return apiFetch<CoverLetterResponse>("/jobs/cover-letter/from-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
