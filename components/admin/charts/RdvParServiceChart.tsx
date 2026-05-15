"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ServiceData } from "@/lib/admin/stats";

interface Props {
  data: ServiceData[];
}

export function RdvParServiceChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-slate-400 text-sm">Pas encore de données</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="service_nom"
          tick={{ fontSize: 11, fill: "#64748b" }}
          width={120}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        />
        <Bar dataKey="count" name="RDV" fill="#062D7A" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
