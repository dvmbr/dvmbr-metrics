"use client";

import { useMemo, useState } from "react";

import { customers, type Customer } from "@/lib/mock/customers";
import { formatCompactCurrency, formatDate } from "@/lib/utils/format";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { Pagination } from "@/components/data-table/pagination";
import { StatusBadge } from "@/components/feedback/status-badge";

const PAGE_SIZE = 10;

const PLAN_LABEL: Record<Customer["plan"], string> = {
  FREE: "Free",
  STARTER: "Starter",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
};

function compareCustomers(a: Customer, b: Customer, key: string): number {
  const av = a[key as keyof Customer];
  const bv = b[key as keyof Customer];
  if (typeof av === "number" && typeof bv === "number") return av - bv;
  // ISO date strings (signupDate/lastActive) sort correctly as plain strings too.
  return String(av).localeCompare(String(bv));
}

const columns: DataTableColumn<Customer>[] = [
  { key: "name", header: "Name", sortable: true, render: (c) => c.name },
  {
    key: "email",
    header: "Email",
    sortable: true,
    render: (c) => <span className="text-foreground-secondary">{c.email}</span>,
  },
  { key: "company", header: "Company", sortable: true, render: (c) => c.company },
  { key: "plan", header: "Plan", sortable: true, render: (c) => PLAN_LABEL[c.plan] },
  { key: "status", header: "Status", sortable: true, render: (c) => <StatusBadge status={c.status} /> },
  {
    key: "monthlyPrice",
    header: "Monthly Payment",
    sortable: true,
    render: (c) => (c.monthlyPrice > 0 ? formatCompactCurrency(c.monthlyPrice) : "—"),
  },
  { key: "country", header: "Country", sortable: true, render: (c) => c.country },
  {
    key: "signupDate",
    header: "Signup Date",
    sortable: true,
    render: (c) => formatDate(c.signupDate),
  },
  {
    key: "lastActive",
    header: "Last Active",
    sortable: true,
    render: (c) => formatDate(c.lastActive),
  },
];

export default function CustomersPage() {
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  function handleSort(key: string) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  }

  const sorted = useMemo(() => {
    const copy = [...customers];
    copy.sort((a, b) => {
      const result = compareCustomers(a, b, sortKey);
      return sortDirection === "asc" ? result : -result;
    });
    return copy;
  }, [sortKey, sortDirection]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={pageData}
        getRowKey={(c) => c.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
