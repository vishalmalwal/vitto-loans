import React from "react";
import { CreditCard, Edit2, FileQuestion, Globe } from "lucide-react";
import { Application } from "../types.ts";
import StatusBadge from "./StatusBadge.tsx";
import LanguageBadge from "./LanguageBadge.tsx";
import SkeletonLoader from "./SkeletonLoader.tsx";

interface ApplicationsTableProps {
  applications: Application[];
  loading: boolean;
  onUpdateStatusTrigger: (app: Application) => void;
}

export default function ApplicationsTable({
  applications,
  loading,
  onUpdateStatusTrigger,
}: ApplicationsTableProps) {
  
  // Format Date using Intl.DateTimeFormat with Indian Kolkata Timezone representation
  const formatDateKolkata = (dateString: string) => {
    try {
      const d = new Date(dateString);
      const formatter = new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      return formatter.format(d);
    } catch (err) {
      console.error("Date format error:", err);
      return dateString;
    }
  };

  return (
    <div className="w-full glass-card rounded-2xl overflow-hidden border border-indigo-500/10 shadow-xl">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm text-[var(--text-primary)]">
          <thead>
            <tr className="bg-indigo-500/5 border-b border-indigo-500/10 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <th className="px-6 py-4 w-12">#</th>
              {/* Sticky first data column (Applicant Name) */}
              <th className="px-6 py-4 sticky left-0 bg-white/95 dark:bg-slate-950/95 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.03)] border-r border-indigo-500/5">
                Applicant Name
              </th>
              <th className="px-6 py-4">Mobile</th>
              <th className="px-6 py-4 text-right">Amount (₹)</th>
              <th className="px-6 py-4 xl:max-w-xs truncate">Purpose</th>
              <th className="px-6 py-4">Language</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Applied Date</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/5">
            {loading ? (
              <SkeletonLoader />
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center p-6 space-y-3">
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 border border-indigo-500/10">
                      <FileQuestion className="w-8 h-8 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[var(--text-primary)]">No applications found</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs mx-auto">
                        There are no matching loan requests currently in the pipeline.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              applications.map((app, index) => (
                <tr key={app.id} className="glass-table-row group">
                  {/* # Counter index */}
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{index + 1}</td>
                  
                  {/* Sticky column layout on mobile/tablet */}
                  <td className="px-6 py-4 font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400 sticky left-0 bg-white/95 dark:bg-slate-950/95 group-hover:bg-slate-100 dark:group-hover:bg-slate-900/95 transition-colors z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)] border-r border-indigo-500/5">
                    {app.name}
                  </td>
                  
                  {/* Mobile details */}
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                    {app.mobile}
                  </td>
                  
                  {/* Currency formatted with Indian Numbering Standard */}
                  <td className="px-6 py-4 text-right font-extrabold text-slate-900 dark:text-slate-100 font-mono text-sm">
                    ₹{app.amount.toLocaleString("en-IN")}
                  </td>
                  
                  {/* Purpose */}
                  <td className="px-6 py-4 text-xs max-w-xs truncate text-[var(--text-secondary)] font-bold font-sans" title={app.purpose}>
                    {app.purpose}
                  </td>
                  
                  {/* Language Badge */}
                  <td className="px-6 py-4">
                    <LanguageBadge language={app.language} />
                  </td>
                  
                  {/* Status Badge */}
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={app.status} />
                  </td>
                  
                  {/* Applied Date (Asia/Kolkata formatter output) */}
                  <td className="px-6 py-4 text-xs font-bold text-slate-700 dark:text-slate-300 font-mono whitespace-nowrap">
                    {formatDateKolkata(app.created_at)}
                  </td>
                  
                  {/* Action Dropdown / Modal Trigger CTA */}
                  <td className="px-6 py-4 text-center">
                    {app.status === "pending" ? (
                      <button
                        onClick={() => onUpdateStatusTrigger(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 border border-indigo-500/10 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 hover:border-indigo-500 transition-all shine-btn cursor-pointer active:scale-95"
                      >
                        <Edit2 className="w-3 h-3" />
                        Update Status
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-sans italic p-1 border border-dotted border-black/5 dark:border-white/5 rounded">
                        Evaluated
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
