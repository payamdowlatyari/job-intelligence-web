import { apiFetch } from "./apiFetch";
import type { IngestResponse } from "../types";

/**
 * Ingests a job from the given URL and returns the ingest response.
 * @param {string} url - The URL of the job to ingest.
 * @returns {Promise<IngestResponse>} - A promise that resolves to the ingest response.
 */
export function ingestJobFromUrl(url: string): Promise<IngestResponse> {
  return apiFetch<IngestResponse>(
    "/jobs/ingest",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: [url] }),
    },
    null,
  );
}
