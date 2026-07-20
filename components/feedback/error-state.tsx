import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong loading this data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
      <p className="text-sm text-foreground-secondary">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
