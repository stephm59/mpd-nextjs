"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TechData } from "@/lib/admin/stats";

interface Props {
  data: TechData[];
}

const COLORS = ["#062D7A", "#1e40af", "#3b82f6", "#60a5fa", "#93c5fd"];

export function RdvParTechChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-slate-400 text-sm">Pas encore de données</p>;
  }

  const chartData = data.map((d) => ({ name: d.technicien_prenom, value: d.count }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: "13px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
