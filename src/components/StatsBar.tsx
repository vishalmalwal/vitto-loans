import React, { useState, useEffect } from "react";
import { Layers, IndianRupee, PieChart } from "lucide-react";
import { Summary } from "../types.ts";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  isCurrency?: boolean;
}

// Custom Counter component to animate figures dynamically on loading
function AnimatedCounter({ value, duration = 1200, isCurrency = false }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const start = 0;
    const end = value;
    
    if (end === 0) {
      setCount(0);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentVal = Math.floor(easedProgress * (end - start) + start);
      
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  if (isCurrency) {
    return <span>₹{count.toLocaleString("en-IN")}</span>;
  }
  return <span>{count.toLocaleString("en-IN")}</span>;
}

interface StatsBarProps {
  summary: Summary | null;
}

export default function StatsBar({ summary }: StatsBarProps) {
  const totalApps = summary?.total ?? 0;
  const totalAmount = summary?.totalAmount ?? 0;
  const pendingCount = summary?.byStatus?.pending ?? 0;
  const approvedCount = summary?.byStatus?.approved ?? 0;
  const rejectedCount = summary?.byStatus?.rejected ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full mb-8">
      
      {/* CARD 1: TOTAL PIPELINE */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all bg-white/70 dark:bg-slate-900/60 shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/10 border border-indigo-500/10">
        <div className="flex items-start justify-between w-full">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Applications</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)] mt-1">
              <AnimatedCounter value={totalApps} />
            </h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/15 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-indigo-500/10">
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold tracking-wide">
            Global loan pipeline volume
          </p>
        </div>
      </div>

      {/* CARD 2: TOTAL REQUESTED VALUE */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all bg-white/70 dark:bg-slate-900/60 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/10 border border-indigo-500/10">
        <div className="flex items-start justify-between w-full">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Amount Requested</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] mt-1 break-all">
              <AnimatedCounter value={totalAmount} isCurrency={true} />
            </h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/15 shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-emerald-500/10">
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wide">
            Indian Local currency format (₹)
          </p>
        </div>
      </div>

      {/* CARD 3: WORKFLOW STATUS SPLIT */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all bg-white/70 dark:bg-slate-900/60 shadow-lg shadow-amber-500/5 hover:shadow-amber-500/10 border border-indigo-500/10">
        <div className="flex items-start justify-between w-full mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Decision Breakdown</span>
          <div className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/15 shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center w-full">
          {/* Pending Split */}
          <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 p-2 rounded-xl flex flex-col justify-between">
            <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-extrabold uppercase">Pending</span>
            <span className="text-sm sm:text-base font-black text-amber-700 dark:text-amber-400 mt-0.5">
              <AnimatedCounter value={pendingCount} />
            </span>
          </div>

          {/* Approved Split */}
          <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 p-2 rounded-xl flex flex-col justify-between">
            <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase">Approved</span>
            <span className="text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
              <AnimatedCounter value={approvedCount} />
            </span>
          </div>

          {/* Rejected Split */}
          <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 dark:border-rose-500/20 p-2 rounded-xl flex flex-col justify-between">
            <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-extrabold uppercase">Rejected</span>
            <span className="text-sm sm:text-base font-black text-rose-700 dark:text-rose-400 mt-0.5">
              <AnimatedCounter value={rejectedCount} />
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
