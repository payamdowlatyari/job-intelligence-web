import { apiFetch } from "./apiFetch";
import type { IngestResponse } from "../types";

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
