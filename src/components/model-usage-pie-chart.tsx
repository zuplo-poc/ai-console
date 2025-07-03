"use client";

import { useEffect, useState } from "react";
import { DonutChart } from "@/components/DonutChart";
import { apiService } from "@/lib/api";

interface ModelUsagePieChartProps {
  subject: string;
}

interface ModelUsageDataPoint {
  name: string;
  amount: number;
}

export function ModelUsagePieChart({ subject }: ModelUsagePieChartProps) {
  const [chartData, setChartData] = useState<ModelUsageDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelUsageData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.getModelUsageData(subject);

        // Process the data for the chart
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
          const formattedData = Object.entries(modelTotals).map(([model, value]) => ({
            name: model,
            amount: value
          }));

          setChartData(formattedData);
        } else {
          // If no data is available, set empty data
          setChartData([]);
        }
      } catch (err) {
        console.error("Error fetching model usage data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch model usage data"
        );
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModelUsageData();
  }, [subject]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading model usage data...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
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
    <DonutChart
      data={chartData}
      className="h-60 w-60"
      category="name"
      value="amount"
      valueFormatter={(number: number) =>
        `${Intl.NumberFormat("us").format(number).toString()} tokens`
      }
    />
  );
}
