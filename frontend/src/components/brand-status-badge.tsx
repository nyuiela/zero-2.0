import React from "react";
import {
  AlertTriangle,
  Loader2,
  Send,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Circle,
  CircleDashed,
} from "lucide-react";
import clsx from "clsx";

// Status to icon/color/label mapping
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: AlertTriangle,
    color: "text-yellow-800",
    bg: "bg-yellow-100",
  },
  in_progress: {
    label: "In progress",
    icon: CircleDashed,
    color: "text-blue-800",
    bg: "bg-blue-100",
    spin: true,
  },
  submitted: {
    label: "Submitted",
    icon: Send,
    color: "text-blue-800",
    bg: "bg-blue-100",
  },
  in_review: {
    label: "In review",
    icon: null, // handled specially
    color: "text-[#00296b]",
    bg: "bg-blue-100",
  },
  success: {
    label: "Success",
    icon: CheckCircle,
    color: "text-green-800",
    bg: "bg-green-100",
  },
  activated: {
    label: "Activated",
    icon: CheckCircle,
    color: "text-green-800",
    bg: "bg-green-100",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-800",
    bg: "bg-red-100",
  },
  expired: {
    label: "Expired",
    icon: Clock,
    color: "text-gray-800",
    bg: "bg-gray-100",
  },
  requested: {
    label: "Requested",
    icon: Clock,
    color: "text-yellow-800",
    bg: "bg-yellow-100",
  },
};

type BrandStatus = keyof typeof STATUS_CONFIG;

export function BrandStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as BrandStatus];
  if (!config) return null;

  // Special composite icon for 'in_review'
  if (status === "in_review") {
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-[15px]",
          config.bg,
          config.color
        )}
        style={{ minWidth: 110 }}
      >
        <span className="relative w-5 h-5 inline-block mr-1">
          <Search className="absolute w-5 h-5 left-0 top-0 text-[#00296b]" />
          <Zap className="absolute w-4 h-3 left-[-2px] bottom-[-2px] text-[#00296b] rounded-full p-[1px]" />
        </span>
        {config.label}
      </span>
    );
  }

  const Icon = config.icon;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-[15px]",
        config.bg,
        config.color
      )}
      style={{ minWidth: 110 }}
    >
      {Icon && (
        <Icon className="w-5 h-5 mr-1" />
      )}
      {config.label}
    </span>
  );
} 