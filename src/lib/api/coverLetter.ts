import { apiFetch } from "./apiFetch";
import type {
  CoverLetterRequest,
  CoverLetterFromUrlRequest,
  CoverLetterResponse,
} from "../types";

/**
 * Generates a cover letter based on the provided job ID, resume text, tone, and length.
 * @param {CoverLetterRequest} data - The data to generate the cover letter from.
 * @returns {Promise<CoverLetterResponse>} - A promise that resolves with the generated cover letter.
 */
export function generateCoverLetter(
  data: CoverLetterRequest,
): Promise<CoverLetterResponse> {
  return apiFetch<CoverLetterResponse>("/jobs/cover-letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Generates a cover letter based on the provided job URL, resume text, tone, and length.
 * @param {CoverLetterFromUrlRequest} data - The data to generate the cover letter from.
 * @returns {Promise<CoverLetterResponse>} - A promise that resolves with the generated cover letter.
 */
export function generateCoverLetterFromUrl(
  data: CoverLetterFromUrlRequest,
): Promise<CoverLetterResponse> {
  return apiFetch<CoverLetterResponse>("/jobs/cover-letter/from-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
