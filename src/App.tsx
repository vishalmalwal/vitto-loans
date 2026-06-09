import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import AnimatedBackground from "./components/AnimatedBackground.tsx";
import ApplyPage from "./pages/ApplyPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import { useApplications } from "./hooks/useApplications.ts";

export default function App() {
  const { dbStatus, loadDashboardData } = useApplications();

  // Load database status metrics immediately to supply to the sticky Navbar
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const storageLabel = dbStatus?.fallbackActive 
    ? "Local Sandbox DB" 
    : "Live PostgreSQL DB";

  return (
    <Router>
      <div className="flex flex-col min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
        
        {/* Transparent aurora mesh gradient blobs floating under code layers */}
        <AnimatedBackground />

        {/* Top sticky glassmorphism Navigation bar */}
        <Navbar dbStorageType={storageLabel} />

        {/* Content Router frame */}
        <main className="flex-grow">
          <Routes>
            {/* Screen 1: Apply page for clients */}
            <Route path="/" element={<ApplyPage />} />
            <Route path="/apply" element={<Navigate to="/" replace />} />

            {/* Screen 2: Admin/Agent review metrics page */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Clean semantic minimalist footer */}
        <footer className="py-6 border-t border-indigo-500/10 text-center text-xs text-slate-500 font-sans tracking-wide">
          <p>© {new Date().getFullYear()} Vitto Loans Inc. All rights reserved. SEC Approved Fintech Lender.</p>
        </footer>

      </div>
    </Router>
  );
}
