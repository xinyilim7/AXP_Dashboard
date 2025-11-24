import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartWrapper from "./chartWrapper";

const COLORS = ["#4CAF50", "#F44336", "#FFC107"];

export function TotalStatusPieChart({ data, loading, error, dateRange, icon }) {
  // useMemo to calculate total counts when data changes
  const pieData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    // calculate total success and failed case for the whole day
    // combine into single result
    /* array.reduce(accumulator, currentItem) => newA ccumulator, initialValue)) */
    const totalSuccess = data.reduce((acc, hour) => acc + hour.success, 0);
    const totalFailed = data.reduce((acc, hour) => acc + hour.failed, 0);
    const totalPending = data.reduce((acc, hour) => acc + hour.pending,0);

    return [
      { name: "Success", value: totalSuccess },
      { name: "Failed", value: totalFailed },
      { name: "Pending", value: totalPending},
    ];
  }, [data]);

  const isInitialLoading = loading && (!data || data.length === 0);
  const title = `Total Transaction Status`;
  return (
    <ChartWrapper
      title= {title}
      loading={isInitialLoading}
      error={error}
      icon={icon}
    >
      <ResponsiveContainer width="100%" height={280} min-height="10px">
        <PieChart >
          <Pie
            data={pieData}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            cx="50%"
            cy="70%"
            outerRadius="70%"
            fill="#8884d8"
            label={(entry) => `${(entry.percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                fontSize={12}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => value.toLocaleString()}
          />
          <Legend iconType="circle"/>
          
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export default TotalStatusPieChart;
