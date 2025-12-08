"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType =
  | "pending"
  | "approved"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "no_show"
  | "active"
  | "inactive"
  | "verified"
  | "unverified";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
  approved: {
    label: "Approved",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  rescheduled: {
    label: "Rescheduled",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  },
  no_show: {
    label: "No Show",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
  verified: {
    label: "Verified",
    className: "bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/10",
  },
  unverified: {
    label: "Unverified",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge
      variant="secondary"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
