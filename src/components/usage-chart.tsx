"use client";

import React from "react";
import { BarChart } from "@/components/BarChart";
import { useUsageData } from "@/hooks/use-usage";
import { format } from "date-fns";
import { RefreshCwIcon } from "lucide-react";

interface UsageChartProps {
  subject: string;
  metric?: string;
  timeRange?: string;
  windowSize?: string;
  showAsCost?: boolean;
}

type UsageDataPoint = {
  date: string;
  tokens: number;
  cost?: number;
  [key: string]: unknown;
};

export function UsageChart({
  subject,
  metric = "tokens_total",
  timeRange = "30d",
  windowSize = "DAY",
  showAsCost = false,
}: UsageChartProps) {
  const { data: response, isLoading, isFetching, error } = useUsageData(subject, metric, timeRange, windowSize);

  // Process the data for the chart
  const chartData: UsageDataPoint[] = React.useMemo(() => {
    if (response && response.data && response.data.data) {
      return response.data.data.map((item: {
        groupBy: Record<string, unknown>;
        subject: string;
        value: number;
        windowEnd: string;
        windowStart: string;
      }) => {
        const tokenValue = item.value;
        const costValue = showAsCost ? (tokenValue * 0.020) / 1000 : 0;
        
        return {
          date: format(new Date(item.windowStart), "MMM dd"),
          tokens: tokenValue,
          cost: costValue,
        };
      });
    } else {
      // If no data is available, create empty data points for the last 7 days
      return Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: format(date, "MMM dd"),
          tokens: 0,
          cost: 0,
        };
      });
    }
  }, [response, showAsCost]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCwIcon className="h-4 w-4 animate-spin" />
          <span>Loading usage data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error instanceof Error ? error.message : "Failed to fetch usage data"}
      </div>
    );
  }

  return (
    <div className="relative">
      {isFetching && (
        <div className="absolute top-2 right-2 z-10">
          <RefreshCwIcon className="h-4 w-4 animate-spin text-blue-500" />
        </div>
      )}
      <BarChart
        className="h-64"
        data={chartData}
        index="date"
        categories={[showAsCost ? "cost" : "tokens"]}
        valueFormatter={(value: number) => {
          if (showAsCost) {
            return `$${value.toFixed(4)}`;
          }
          return `${Intl.NumberFormat("en").format(value)} tokens`;
        }}
        showYAxis={true}
      />
    </div>
  );
}
