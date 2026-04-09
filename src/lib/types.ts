export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type?: string;
  description_clean?: string;
  summary?: string;
  url?: string;
  posted_date?: string;
}

export interface MatchResult {
  similarity_score: number;
  match_reason?: string;
  job: Job;
}

export interface MatchResponse {
  total_candidates: number;
  matches: MatchResult[];
}

export interface MatchRequest {
  resume_text: string;
  skills?: string[];
  location?: string;
  company?: string;
  job_type?: string;
  top_k?: number;
}

export interface CoverLetterRequest {
  job_id: string;
  resume_text: string;
  tone: string;
  length: string;
}

export interface CoverLetterFromUrlRequest {
  job_url: string;
  resume_text: string;
  tone: string;
  length: string;
}

export interface CoverLetterResponse {
  cover_letter: string;
}
