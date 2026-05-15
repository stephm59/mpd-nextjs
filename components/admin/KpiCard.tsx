import { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: "default" | "warning" | "success";
  icon?: ReactNode;
}

export function KpiCard({ label, value, sublabel, accent = "default" }: KpiCardProps) {
  const accentColor = {
    default: "text-slate-900",
    warning: "text-amber-600",
    success: "text-emerald-600",
  }[accent];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${accentColor}`}>
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-slate-500">{sublabel}</p>
      )}
    </div>
  );
}
