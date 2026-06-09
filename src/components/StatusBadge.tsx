import React from "react";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: {
      text: "Pending",
      classes: "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      dotClass: "bg-amber-500",
    },
    approved: {
      text: "Approved",
      classes: "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      dotClass: "bg-emerald-500",
    },
    rejected: {
      text: "Rejected",
      classes: "bg-gradient-to-r from-rose-500/10 to-orange-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      dotClass: "bg-rose-500",
    },
  };

  const selected = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border pulse-badge shadow-sm ${selected.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${selected.dotClass}`} />
      {selected.text}
    </span>
  );
}
