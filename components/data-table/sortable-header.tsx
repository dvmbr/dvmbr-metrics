import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  activeSortKey?: string | null;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
}

export function SortableHeader({
  label,
  sortKey,
  activeSortKey,
  sortDirection = "asc",
  onSort,
}: SortableHeaderProps) {
  const isActive = activeSortKey === sortKey;

  if (!onSort) {
    return (
      <th scope="col" className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </th>
    );
  }

  return (
    <th scope="col" className="px-4 py-2 text-left">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        aria-label={`Sort by ${label}`}
        className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
        {isActive ? (
          sortDirection === "asc" ? (
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" aria-hidden="true" />
        )}
      </button>
    </th>
  );
}
