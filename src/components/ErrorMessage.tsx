import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive",
        className
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
