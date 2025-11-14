import React from "react";
import { useAppSelector } from "../../state/hooks"; // Ensure this path is correct
import {
  LineChart, // USE LineChart
  Line, // USE Line
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import ChartWrapper from "./chartWrapper";

export function TrendChart({
  data,
  loading,
  error,
  icon,
  dateRange,
  headerActions,
}) {
  const isInitialLoading = loading && (!data || data.length === 0);
  const title = `Transaction Status Trend (${dateRange})`;

  const scrollContainerRef = React.useRef(null);
  const {
    selectedDayOfWeek, // 0-6 (Sun-Sat) from filter
    selectedDate, // 1-31
    selectedMonth, // 0-11
  } = useAppSelector((state) => state.dashboard.filters);

  const xAxisKey = dateRange === "Daily" ? "minute" : "label";

  // We use barWidth for scrolling calculation, even with a line chart
  const barWidth = dateRange === "Daily" ? 40 : 25;
  const chartWidth = data.length * barWidth;

  React.useEffect(() => {
    // Check if data is loaded before scrolling
    if (
      !scrollContainerRef.current ||
      dateRange === "Daily" ||
      !data ||
      data.length === 0
    ) {
      return;
    }

    const now = new Date();
    const currentLiveMonth= now.getUTCMonth();

    const barsPerDay = 24 * 60; // 1440 data points per day
    let dayIndex = 0;

    // --- THIS IS THE LOGIC FIX ---
    if (dateRange === "Weekly") {
      // Convert filter index (Sun=0) to data index (Mon=0)
      dayIndex = (selectedDayOfWeek + 6) % 7;
      // e.g., Filter Sun=0 -> (0 + 6) % 7 = 6 (Data index 6 is Sun)
      // e.g., Filter Mon=1 -> (1 + 6) % 7 = 0 (Data index 0 is Mon)
    } else if (dateRange === "Monthly") {
      dayIndex = selectedDate - 1; // Date "1" is index 0. This is correct.
    }

    // This calculates the pixel position to scroll to
    const scrollPos = dayIndex * barsPerDay * barWidth;

    scrollContainerRef.current.scrollTo({
      left: scrollPos,
      behavior: "smooth",
    });
  }, [
    selectedDayOfWeek,
    selectedDate,
    selectedMonth,
    dateRange,
    barWidth,
    data.length,
  ]);

  return (
    <ChartWrapper
      title={title}
      loading={isInitialLoading}
      error={error}
      icon={icon}
      headerActions={headerActions}
    >
      {/**Add scrolling wrapper */}
      <div
        ref={scrollContainerRef}
        style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
      >
        <ResponsiveContainer
          width={chartWidth < 600 ? "100%" : chartWidth}
          height={280}
        >
          {/* --- THIS IS THE PERFORMANCE FIX --- */}
          <LineChart
            data={data}
            margin={{ top: 20, right: 0, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false}>
              <Label
                value={dateRange === "Daily" ? "Time (Hour)" : "Date"}
                position="insideBottom"
                dy={20} // Adjusts vertical position
                style={{ fill: "var(--text-muted)" }}
              />
            </XAxis>
            <YAxis
              allowDecimals={false}
              tickFormatter={(value) => value.toLocaleString()}
              width={80}
              label={{
                value: "Transaction Count",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                style: {
                  fill: "var(--text-muted)",
                  textAnchor: "middle",
                  fontWeight:700,
                },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--accent)",
                borderRadius: "8px",
              }}
            />

            <Line
              type="monotone"
              dataKey="success"
              stroke="#14bd85ff"
              strokeWidth={3.5} 
              name="Successful Txns"
              dot={false}
              isAnimationActive={false} // Disable animation
            />
            <Line
              type="monotone"
              dataKey="failed"
              stroke="#F44336"
              strokeWidth={1}
              name="Failure Txns"
              dot={false}
              isAnimationActive={false} // Disable animation
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend (This code is fine) */}
      <div
        style={{
          width: "100%",
          paddingTop: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: "#14bd85ff",
            }}
          />
          <span style={{ fontSize: "18px", color: "var(--text-secondary)" }}>
            Successful Txns
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: "#F44336",
            }}
          />
          <span style={{ fontSize: "18px", color: "var(--text-secondary)" }}>
            Failure Txns
          </span>
        </div>
      </div>
    </ChartWrapper>
  );
}

export default TrendChart;
