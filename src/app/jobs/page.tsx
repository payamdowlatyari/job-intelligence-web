"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter } from "lucide-react";
import { fetchJobs } from "@/lib/api/jobs";
import { JobCard } from "@/components/JobCard";
import { Spinner } from "@/components/Spinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * The JobsPage component renders a page for browsing jobs.
 * It displays a form with four fields: keyword, company, location, and job type.
 * The form can be submitted to search for jobs with the given filters.
 * The component also renders a list of job cards with the search results.
 * If no jobs are found, it renders an empty state message.
 * If there is an error loading the jobs, it renders an error message.
 */
export default function JobsPage() {
  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const [filters, setFilters] = useState({
    keyword: "",
    company: "",
    location: "",
    job_type: "",
  });

  const {
    data: jobs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => fetchJobs(filters),
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters({ keyword, company, location, job_type: jobType });
  }

  function handleReset() {
    setKeyword("");
    setCompany("");
    setLocation("");
    setJobType("");
    setFilters({ keyword: "", company: "", location: "", job_type: "" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-6">
        Browse Jobs
      </h1>

      <form
        onSubmit={handleSearch}
        className="mb-8 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="keyword">Keyword</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="keyword"
                placeholder="Job title, skills…"
                className="pl-8"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Company name"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, state, remote…"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="job_type">Job Type</Label>
            <Input
              id="job_type"
              placeholder="Full-time, part-time…"
              value={jobType}
              onChange={e => setJobType(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button type="submit" className="gap-2">
            <Filter className="h-4 w-4" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>

      {isLoading && <Spinner />}
      {isError && (
        <ErrorMessage
          message={(error as Error)?.message ?? "Failed to load jobs."}
        />
      )}
      {!isLoading && !isError && jobs && jobs.length === 0 && (
        <EmptyState message="No jobs found. Try adjusting your filters." />
      )}
      {!isLoading && !isError && jobs && jobs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
