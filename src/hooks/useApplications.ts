import { useState, useEffect, useCallback, useMemo } from "react";
import axiosClient from "../api/axios.ts";
import { Application, Summary, DatabaseStatus } from "../types.ts";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Database configuration status (checks if PostgreSQL is connected or fallback active)
  const fetchDbStatus = useCallback(async () => {
    try {
      const res = await axiosClient.get<DatabaseStatus>("/db-status");
      setDbStatus(res.data);
    } catch (err) {
      console.error("Failed to retrieve db health state:", err);
    }
  }, []);

  // Fetch Summary statistics
  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const res = await axiosClient.get<Summary>("/summary");
      setSummary(res.data);
    } catch (err: any) {
      console.error("Failed to query API summary:", err);
      setError("Failed to fetch aggregate metrics.");
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Fetch Applications (with optional status filter)
  const fetchApplications = useCallback(async (status?: string) => {
    setLoadingApps(true);
    try {
      const url = status && status !== "all" ? `/applications?status=${status}` : "/applications";
      const res = await axiosClient.get<Application[]>(url);
      setApplications(res.data);
    } catch (err: any) {
      console.error("Failed to query API applications:", err);
      setError("Failed to fetch application records from server.");
    } finally {
      setLoadingApps(false);
    }
  }, []);

  // Parallel loading for initial page load
  const loadDashboardData = useCallback(async (statusFilter?: string) => {
    setLoadingApps(true);
    setLoadingSummary(true);
    setError(null);
    try {
      await Promise.all([
        fetchDbStatus(),
        fetchSummary(),
        fetchApplications(statusFilter),
      ]);
    } catch (err) {
      console.error("Parallel loader failed:", err);
    }
  }, [fetchDbStatus, fetchSummary, fetchApplications]);

  // Submit a new application
  const submitApplication = async (data: Omit<Application, "id" | "status" | "created_at">) => {
    try {
      const res = await axiosClient.post<Application>("/applications", data);
      // Update summary and table records dynamically in state
      fetchSummary();
      return { success: true, data: res.data };
    } catch (err: any) {
      console.error("Application insert failed:", err);
      const errMsg = err.response?.data?.error || "Submission failed. Please check form parameters.";
      return { success: false, error: errMsg };
    }
  };

  // Upddate local state directly when StatusUpdateModal updates status (no page reload)
  const updateLocalAppStatus = useCallback((id: string, updatedApp: Application) => {
    // 1. Update applications list
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? updatedApp : app))
    );
    // 2. Refresh aggregate metrics bar
    fetchSummary();
  }, [fetchSummary]);

  return {
    applications,
    summary,
    dbStatus,
    loadingApps,
    loadingSummary,
    error,
    loadDashboardData,
    fetchApplications,
    fetchSummary,
    submitApplication,
    updateLocalAppStatus,
  };
}
