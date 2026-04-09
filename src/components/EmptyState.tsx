import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message?: string;
  className?: string;
}

/**
 * A component that displays an empty state message.
 * @param {{ message: string, className: string }} - The properties of the component.
 */
export function EmptyState({
  message = "No results found.",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground",
        className,
      )}>
      <Inbox className="h-10 w-10 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
