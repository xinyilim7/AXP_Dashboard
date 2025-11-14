// Reusable chart for feature #1
import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartWrapper from "./chartWrapper";

export function FailedTrendChart({ data, loading, error, icon, dateRange }) {
  const isInitialLoading = loading && (!data || data.length === 0);
  const title = `Transaction Failed Trend (${dateRange})`;

  console.log("Chart Data Received:", data);
  useEffect(() => {
    // This hook runs *only* when the 'data' prop changes
    if (data && data.length > 0) {
      // Get the current UTC hour (just like the API does)
      const currentHour = new Date().getUTCHours();
      const currentHourKey = `${currentHour < 10 ? "0" : ""}${currentHour}:00`;
    }
  }, [data]); // <-- This dependency array is the magic.

  return (
    <ChartWrapper
      title={title}
      loading={isInitialLoading}
      error={error}
      icon={icon}
    >
      <ResponsiveContainer width="100%" height={280} min-height="10px">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#cdcbcbff" />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            label={{
              value: "Hour of UTC (UTC)",
              position: "bottom",
              offset: 0,
            }}
          />
          <YAxis
            allowDecimals={false}
            tickerFormatter={(value) => value.toLocaleString()}
            width={80}
            label={{
              value: "Transaction Count",
              angle: -90, 
              position: "insideLeft", 
              offset: 0,
              style: { textAnchor: "middle" },
            }}
          />
          {/*tickFormatter= format number 1000 --> 1,000 */}
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--accent)",
              borderRadius: "8px",
            }}
          />
          {/*Explaining wht each colored line means */}
          <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
          {/*Failure Transaction */}
          <Line
            type="monotone"
            dataKey="failed"
            stroke="#F44336"
            strokeWidth={3}
            name="Failure Txns"
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export default FailedTrendChart;
