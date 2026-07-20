import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  icon?: LucideIcon;
}

export function EmptyState({ message = "Nothing here yet.", icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm text-foreground-secondary">{message}</p>
    </div>
  );
}
