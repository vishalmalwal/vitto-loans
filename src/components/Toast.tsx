import React, { useEffect } from "react";
import { CheckCircle2, X, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div 
      style={{ animationDuration: '0.35s' }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-xl animate-bounce-in ${
        type === "success" 
          ? "bg-slate-900/90 dark:bg-slate-100/95 text-white dark:text-slate-900 border-emerald-500/30" 
          : "bg-rose-950/90 border-rose-500/30 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-400" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button 
        onClick={onClose} 
        className="p-1 hover:bg-white/10 dark:hover:bg-black/10 rounded-full transition-colors ml-2"
        aria-label="Close Notification"
      >
        <X className="w-4 h-4 opacity-70" />
      </button>
    </div>
  );
}
