import React from "react";

export default function SkeletonLoader() {
  return (
    <>
      {[1, 2, 3].map((key) => (
        <tr key={key} className="border-b border-indigo-500/10 animate-pulse">
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-6" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-28 mb-1" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-24" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-20" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-32" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-16" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded-full w-20" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-28" />
          </td>
          <td className="px-6 py-4">
            <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-24" />
          </td>
        </tr>
      ))}
    </>
  );
}
