import React, { useEffect, useState, useMemo } from "react";
import { Search, SlidersHorizontal, RefreshCw, FileText, Database, ShieldAlert } from "lucide-react";
import { useApplications } from "../hooks/useApplications.ts";
import StatsBar from "../components/StatsBar.tsx";
import ApplicationsTable from "../components/ApplicationsTable.tsx";
import StatusUpdateModal from "../components/StatusUpdateModal.tsx";
import Toast from "../components/Toast.tsx";
import { Application } from "../types.ts";

export default function DashboardPage() {
  const {
    applications,
    summary,
    dbStatus,
    loadingApps,
    loadDashboardData,
    updateLocalAppStatus,
  } = useApplications();

  // Filter and input search states
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal target application pointer
  const [activeModalApp, setActiveModalApp] = useState<Application | null>(null);

  // Toast notifications states
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Perform parallel fetching on component load and whenever status filter toggles
  useEffect(() => {
    loadDashboardData(statusFilter);
  }, [statusFilter, loadDashboardData]);

  // Real-time client-side search query on name or mobile
  const searchedApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return applications;
    }
    return applications.filter((app) => {
      const matchName = app.name.toLowerCase().includes(query);
      const matchMobile = app.mobile.includes(query);
      return matchName || matchMobile;
    });
  }, [applications, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8 min-h-[calc(100vh-160px)]">
      
      {/* Title Header area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 bg-clip-text text-transparent">
            Agent Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-0.5">
            Review live client loan requests, verify documents, and issue approvals.
          </p>
        </div>

        {/* Sync trigger button */}
        <button
          onClick={() => loadDashboardData(statusFilter)}
          disabled={loadingApps}
          className="inline-flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-xl border border-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-400 backdrop-blur-md bg-white/30 dark:bg-slate-900/40 hover:bg-indigo-500/10 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingApps ? "animate-spin" : ""}`} />
          Force Refresh
        </button>
      </div>

      {/* Aggregate counts stats bar */}
      <StatsBar summary={summary} />

      {/* Database fallback warnings inside Agent console */}
      {dbStatus?.fallbackActive && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/15 text-amber-800 dark:text-amber-400 text-xs sm:text-sm shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Sandbox Fallback Active:</span>
            <p className="opacity-95 leading-relaxed leading-relaxed leading-relaxed font-medium">
              No live postgres connection URL detected. Database queries are falling back to local file storage at <code className="font-mono bg-black/5 p-0.5 rounded">backend/data/applications.json</code>. Form submissions and decisions will be persisted successfully inside the sandbox environment.
            </p>
          </div>
        </div>
      )}

      {/* Filter and real-time search interface */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-950/40 border border-indigo-500/10 backdrop-blur-xl p-4 rounded-2xl">
        
        {/* Left side Filter option */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <label htmlFor="pipeline-status-filter" className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] whitespace-nowrap hidden sm:inline-block">Filter Decision:</label>
          <select
            id="pipeline-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-indigo-500/10 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500"
          >
            <option value="all" className="bg-white dark:bg-slate-900">All Status Pipelines</option>
            <option value="pending" className="bg-white dark:bg-slate-900">Pending Eval</option>
            <option value="approved" className="bg-white dark:bg-slate-900">Approved Loans</option>
            <option value="rejected" className="bg-white dark:bg-slate-900">Rejected Decisions</option>
          </select>
        </div>

        {/* Right side real-time search field */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            id="pipeline-search-input"
            type="text"
            placeholder="Search by Name or Mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-indigo-500/10 outline-none glow-input text-slate-800 dark:text-slate-200"
          />
        </div>

      </div>

      {/* Main Loan applications Table list */}
      <ApplicationsTable
        applications={searchedApplications}
        loading={loadingApps}
        onUpdateStatusTrigger={(app) => setActiveModalApp(app)}
      />

      {/* Backdrop modal instance */}
      {activeModalApp && (
        <StatusUpdateModal
          app={activeModalApp}
          onClose={() => setActiveModalApp(null)}
          onStatusUpdated={(id, updated) => updateLocalAppStatus(id, updated)}
          showToast={showToast}
        />
      )}

      {/* Floating Notifications system */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

    </div>
  );
}
