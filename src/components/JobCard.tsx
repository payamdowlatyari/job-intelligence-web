import Link from "next/link";
import { Briefcase, Building2, MapPin, Calendar, Clock } from "lucide-react";
import type { Job } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job;
}

/**
 * JobCard component displays a job card with title, company, location, and job type.
 *
 * @param {JobCardProps} props - JobCard props
 */
export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
            {job.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{job.company}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          {job.job_type && (
            <div className="mt-1">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 w-fit">
                <Briefcase className="h-3 w-3" />
                {job.job_type}
              </Badge>
            </div>
          )}
          {(job.date_posted || job.posted_date) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 shrink-0" />
              <span>
                Posted:{" "}
                {new Date(
                  job.date_posted || job.posted_date || "",
                ).toLocaleDateString()}
              </span>
            </div>
          )}
          {job.created_at && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0" />
              <span>
                Added: {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
          {job.skills && job.skills.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {job.skills.slice(0, 4).map(skill => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 4}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
