"use client";

import React from "react";
import { DonutChart } from "@/components/DonutChart";
import { useModelUsageData } from "@/hooks/use-usage";
import { RefreshCwIcon } from "lucide-react";

interface ModelUsagePieChartProps {
  subject: string;
}

interface ModelUsageDataPoint {
  name: string;
  amount: number;
}

export function ModelUsagePieChart({ subject }: ModelUsagePieChartProps) {
  const { data: response, isLoading, isFetching, error } = useModelUsageData(subject);

  // Process the data for the chart
  const chartData: ModelUsageDataPoint[] = React.useMemo(() => {
    if (response && response.data && response.data.data) {
      // Aggregate data by model
      const modelTotals: Record<string, number> = {};
      
      response.data.data.forEach((item: {
        groupBy: { model: string };
        value: number;
      }) => {
        const model = item.groupBy.model || 'unknown';
        if (!modelTotals[model]) {
          modelTotals[model] = 0;
        }
        modelTotals[model] += item.value;
      });

      // Convert to array format needed for DonutChart
      return Object.entries(modelTotals).map(([model, value]) => ({
        name: model,
        amount: value
      }));
    } else {
      // If no data is available, return empty array
      return [];
    }
  }, [response]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCwIcon className="h-4 w-4 animate-spin" />
          <span>Loading model usage data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error instanceof Error ? error.message : "Failed to fetch model usage data"}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No model usage data available
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
      <DonutChart
        data={chartData}
        className="h-60 w-60"
        category="name"
        value="amount"
        valueFormatter={(number: number) =>
          `${Intl.NumberFormat("us").format(number).toString()} tokens`
        }
      />
    </div>
  );
}
