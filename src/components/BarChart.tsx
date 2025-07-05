import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AvailableChartColors, type AvailableChartColorsKeys } from "../chartUtils";

interface BarChartProps {
  className?: string;
  data: Record<string, unknown>[];
  index: string;
  categories: string[];
  colors?: AvailableChartColorsKeys[];
  valueFormatter?: (value: number) => string;
  showYAxis?: boolean;
}

export function BarChart({
  className,
  data,
  index,
  categories,
  colors = AvailableChartColors,
  valueFormatter = (v) => v.toString(),
  showYAxis = true,
}: BarChartProps) {
  const category = categories[0];
  const color = colors[0] || "blue";
  
  // Convert Tailwind color to hex for Recharts
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    emerald: "#10b981",
    violet: "#8b5cf6",
    amber: "#f59e0b",
    gray: "#6b7280",
    cyan: "#06b6d4",
    pink: "#ec4899",
    lime: "#84cc16",
    fuchsia: "#d946ef",
  };
  
  const barColor = colorMap[color] || "#3b82f6";
  
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={240}>
        <RechartsBarChart data={data} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={index} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          {showYAxis && (
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
          )}
          <Tooltip 
            formatter={valueFormatter}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey={category} fill={barColor} barSize={20} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
} 