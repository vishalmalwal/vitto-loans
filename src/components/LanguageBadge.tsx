import React from "react";

interface LanguageBadgeProps {
  language: "Hindi" | "Tamil" | "Telugu" | "Marathi" | "English";
}

export default function LanguageBadge({ language }: LanguageBadgeProps) {
  const config = {
    Hindi: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    Tamil: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Telugu: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    Marathi: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    English: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  };

  const badgeClass = config[language] || config.English;

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium border ${badgeClass}`}>
      {language}
    </span>
  );
}
