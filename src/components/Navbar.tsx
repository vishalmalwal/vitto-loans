import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, Coins, HelpCircle } from "lucide-react";
import { useTheme } from "../hooks/useTheme.ts";

interface NavbarProps {
  dbStorageType: string;
}

export default function Navbar({ dbStorageType }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Apply Now", path: "/" },
    { name: "Agent Dashboard", path: "/dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-[rgba(255,255,255,0.4)] dark:bg-[rgba(10,10,26,0.5)] border-b border-indigo-500/10 backdrop-blur-md transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/10 group-hover:shadow-indigo-500/25 transition-all duration-300">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 bg-clip-text text-transparent">
                Vitto Loans
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/15"
                    : "text-slate-600 hover:text-indigo-500 hover:bg-indigo-500/5 dark:text-slate-300 dark:hover:text-indigo-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Row - Desktop / Tablet */}
          <div className="flex items-center gap-3">
            
            {/* Database status pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span>{dbStorageType}</span>
            </div>

            {/* Dark & Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl border border-indigo-500/10 bg-white/20 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 hover:bg-indigo-500/5 hover:border-indigo-500/20 active:scale-95 transition-all duration-200"
              aria-label="Toggle visual theme preference"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl border border-indigo-500/10 bg-white/20 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200"
              aria-label="Toggle Navigation Options"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 sm:top-20 left-0 right-0 glass-card bg-white/95 dark:bg-slate-950/95 border-b border-indigo-500/15 py-5 px-4 shadow-2xl animate-fade-in z-50">
          <div className="flex flex-col gap-2">
            
            {/* Status indicator pill on mobile */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>Database: {dbStorageType}</span>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/15"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
