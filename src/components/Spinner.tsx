import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}

/**
 * A loading spinner component.
 *
 * @param {string} [className] - Optional class name for the spinner.
 */
export function Spinner({ className }: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
