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
    color: "text-orange-400",
    bg: "bg-orange-900/30",
  },
  in_progress: {
    label: "In progress",
    icon: CircleDashed,
    color: "text-blue-700 font-bold",
    bg: "bg-blue-900/40",
    spin: true,
  },
  submitted: {
    label: "Submitted",
    icon: Send,
    color: "text-violet-800",
    bg: "bg-violet-900/60",
  },
  in_review: {
    label: "In review",
    icon: null, // handled specially
    color: "text-yellow-400",
    bg: "bg-green-900",
  },
  success: {
    label: "Success",
    icon: CheckCircle,
    color: "text-yellow-400",
    bg: "bg-yellow-900/90",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-700",
    bg: "bg-red-900/60",
  },
  expired: {
    label: "Expired",
    icon: Clock,
    color: "text-gray-400",
    bg: "bg-gray-800/60",
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
          "inline-flex items-center gap-2 px-3 py-1 rounded font-medium text-[15px]",
          config.bg,
          config.color
        )}
        style={{ minWidth: 110 }}
      >
        <span className="relative w-5 h-5 inline-block mr-1">
          <Search className="absolute w-5 h-5 left-0 top-0" />
          <Zap className="absolute w-4 h-3 bg-yellow-700/40 left-[-2px] bottom-[-2px] text-yellow-400 rounded-full p-[1px]" />
        </span>
        {config.label}
      </span>
    );
  }

  const Icon = config.icon;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1 rounded font-medium text-[15px]",
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