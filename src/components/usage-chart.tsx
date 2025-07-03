"use client";

import { useEffect, useState } from "react";
import { AreaChart } from "@/components/AreaChart";
import { apiService } from "@/lib/api";
import { format } from "date-fns";

interface UsageChartProps {
  subject: string;
  metric?: string;
  timeRange?: string;
  windowSize?: string;
  showAsCost?: boolean;
}

interface UsageDataPoint {
  date: string;
  tokens: number;
}

export function UsageChart({
  subject,
  metric = "tokens_total",
  timeRange = "30d",
  windowSize = "DAY",
  showAsCost = false,
}: UsageChartProps) {
  const [chartData, setChartData] = useState<UsageDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.getUsageData(
          subject,
          metric,
          timeRange,
          windowSize
        );

        // Process the data for the chart
        if (response && response.data && response.data.data) {
          const formattedData = response.data.data.map((item: {
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

          setChartData(formattedData);
        } else {
          // If no data is available, create empty data points for the last 7 days
          const emptyData = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
              date: format(date, "MMM dd"),
              tokens: 0,
              cost: 0,
            };
          });
          setChartData(emptyData);
        }
      } catch (err) {
        console.error("Error fetching usage data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch usage data"
        );
        
        // Create empty data on error
        const emptyData = Array.from({ length: 7 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            date: format(date, "MMM dd"),
            tokens: 0,
            cost: 0,
          };
        });
        setChartData(emptyData);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [subject, metric, timeRange, windowSize, showAsCost]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading usage data...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <AreaChart
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
  );
}
