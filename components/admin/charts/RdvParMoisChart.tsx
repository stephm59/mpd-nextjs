"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { MoisData } from "@/lib/admin/stats";

interface Props {
  data: MoisData[];
}

export function RdvParMoisChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "13px" }} />
        <Line
          type="monotone"
          dataKey="confirmes"
          name="Confirmés"
          stroke="#062D7A"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="annules"
          name="Annulés"
          stroke="#dc2626"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
