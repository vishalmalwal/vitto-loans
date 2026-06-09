import React, { useState } from "react";
import { X, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import axiosClient from "../api/axios.ts";
import { Application } from "../types.ts";

interface StatusUpdateModalProps {
  app: Application;
  onClose: () => void;
  onStatusUpdated: (id: string, updatedApp: Application) => void;
  showToast: (message: string, type?: "success" | "error") => void;
}

export default function StatusUpdateModal({
  app,
  onClose,
  onStatusUpdated,
  showToast,
}: StatusUpdateModalProps) {
  const [submittingAction, setSubmittingAction] = useState<"approved" | "rejected" | null>(null);

  const handleUpdate = async (newStatus: "approved" | "rejected") => {
    setSubmittingAction(newStatus);
    try {
      const res = await axiosClient.patch(`/applications/${app.id}/status`, {
        status: newStatus,
      });
      // Trigger parent callback on successful PATCH
      onStatusUpdated(app.id, res.data);
      showToast(`Application successfully ${newStatus}!`, "success");
      onClose();
    } catch (err: any) {
      console.error("Failed to patch status:", err);
      const errMsg = err.response?.data?.error || "Failed to update status. Please try again.";
      showToast(errMsg, "error");
    } finally {
      setSubmittingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/45 dark:bg-black/60 backdrop-blur-md cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md glass-card p-6 rounded-2xl shadow-2xl border border-indigo-500/20 bg-white/80 dark:bg-slate-950/85 z-10 transition-all text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-500/10 mb-4">
          <h3 className="text-lg font-bold tracking-tight">Review Application</h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name and application overview */}
        <div className="mb-6 space-y-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Applicant Name</span>
            <p className="text-base font-bold mt-0.5">{app.name}</p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Requested Amount</span>
            <p className="text-xl font-extrabold mt-0.5 text-indigo-600 dark:text-indigo-300">
              ₹{app.amount.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Purpose</span>
            <p className="text-xs italic bg-black/5 dark:bg-white/5 p-2.5 rounded-lg border border-black/5 dark:border-white/5 leading-relaxed text-slate-600 dark:text-slate-300">
              "{app.purpose}"
            </p>
          </div>
        </div>

        {/* Warning about finality */}
        <p className="text-[11px] mb-6 flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Setting status to Approved or Rejected is final and cannot be undone.</span>
        </p>

        {/* CTA Actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Reject CTA */}
          <button
            onClick={() => handleUpdate("rejected")}
            disabled={submittingAction !== null}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 transition-all shine-btn disabled:opacity-50 disabled:pointer-events-none"
          >
            {submittingAction === "rejected" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
            Reject Application
          </button>

          {/* Approve CTA */}
          <button
            onClick={() => handleUpdate("approved")}
            disabled={submittingAction !== null}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all shine-btn disabled:opacity-50 disabled:pointer-events-none"
          >
            {submittingAction === "approved" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Approve Loan
          </button>
        </div>

      </div>
    </div>
  );
}
