import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { SortableHeader } from "@/components/data-table/sortable-header";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  sortKey?: string | null;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  state?: "loading" | "error" | "empty" | "success";
  onRetry?: () => void;
  emptyMessage?: string;
  errorMessage?: string;
  skeletonRows?: number;
}

// Generic enough to serve customers, revenue transactions, and reports — see
// docs/components.md. Sort/pagination are controlled (parent owns the state),
// so this stays a dumb rendering component whether the parent drives it from
// local useState (now) or URL search params (Phase 5) later.
export function DataTable<T>({
  columns,
  data,
  getRowKey,
  sortKey,
  sortDirection,
  onSort,
  state = "success",
  onRetry,
  emptyMessage,
  errorMessage,
  skeletonRows = 6,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <SortableHeader
                key={column.key}
                label={column.header}
                sortKey={column.key}
                activeSortKey={sortKey}
                sortDirection={sortDirection}
                onSort={column.sortable ? onSort : undefined}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {state === "loading" &&
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="border-b border-divider last:border-0">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    <LoadingSkeleton className="h-4 w-3/4" />
                  </td>
                ))}
              </tr>
            ))}

          {state === "success" &&
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                className="border-b border-divider transition-colors last:border-0 hover:bg-(--overlay-hover)"
              >
                {columns.map((column) => (
                  <td key={column.key} className={cn("px-4 py-3 text-foreground", column.className)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {state === "error" && (
        <div className="p-2">
          <ErrorState message={errorMessage} onRetry={onRetry} />
        </div>
      )}
      {state === "empty" && (
        <div className="p-2">
          <EmptyState message={emptyMessage} />
        </div>
      )}
    </div>
  );
}
