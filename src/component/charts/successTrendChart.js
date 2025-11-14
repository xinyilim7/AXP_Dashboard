// // Reusable chart for feature #1
// import React, { useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import ChartWrapper from "./chartWrapper";

// export function SuccessTrendChart({ data, loading, error, icon, dateRange}) {
//   const isInitialLoading = loading && (!data || data.length === 0);
//   const title = `Transaction Success Trend (${dateRange})`;
  
//   console.log("Chart Data Received:", data);
//   useEffect(() => {
//     // This hook runs *only* when the 'data' prop changes
//     if (data && data.length > 0) {
//       // Get the current UTC hour (just like the API does)
//       const currentHour = new Date().getUTCHours();
//       const currentHourKey = `${currentHour < 10 ? "0" : ""}${currentHour}:00`;
//     }
//   }, [data]); // <-- This dependency array is the magic.

//   return (
//     <ChartWrapper
//       title={title}
//       loading={isInitialLoading}
//       error={error}
//       icon={icon}
//     >
//       <ResponsiveContainer width="100%" height={280} min-height="10px">
//         <LineChart
//           data={data}
//           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#cdcbcbff" />
//           <XAxis
//             /**Use 'xAxisKey prop*/
//             dataKey="hour"
//             tickLine={false}
//             axisLine={false}
//             label={{
//               value: "Hour of UTC (UTC)",
//               position: "bottom",
//               offset: 0,
//             }}
//           />
//           <YAxis
//             allowDecimals={false}
//             tickerFormatter={(value) => value.toLocaleString()}
//             width={80}
//             label={{
//               value: "Transaction Count",
//               angle: -90, 
//               position: "insideLeft", 
//               offset: 0,
//               style: { textAnchor: "middle" },
//             }}
//           />
//           {/*tickFormatter= format number 1000 --> 1,000 */}
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "var(--card-bg)",
//               border: "1px solid var(--accent)",
//               borderRadius: "8px",
//             }}
//           />
//           {/*Explaining wht each colored line means */}
//           <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
//           {/*Successful Transaction */}
//           <Line
//             type="monotone"
//             dataKey="success"
//             stroke="#14bd85ff"
//             strokeWidth={3}
//             name="Successful Txns"
//             dot={{ r: 5 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </ChartWrapper>
//   );
// }

// export default SuccessTrendChart;


// Trend Bar Chart
import React from "react";
import { useAppSelector } from "../../state/hooks"; 
import {
  BarChart,
  Bar,
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
    selectedDayOfWeek, // 0-6 (Sun-Sat)
    selectedDate, // 1-31
    selectedMonth, // 0-11
  } = useAppSelector((state) => state.dashboard.filters);

  const xAxisKey = dateRange === "Daily" ? "minute" : "label";
  const barWidth = dateRange === "Daily" ? 40 : 25;
  const chartWidth = data.length * barWidth;

  React.useEffect(() => {
    if (!scrollContainerRef.current || dateRange === "Daily") return;
    const barsPerDay = 24 * 60; // 1440 bars per day
    let dayIndex = 0;

    if (dateRange === "Weekly") {
      dayIndex = (selectedDayOfWeek +6)%7; 
    } else if (dateRange === "Monthly") {
      dayIndex = selectedDate - 1; // Date "1" is index 0
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
      <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
        <ResponsiveContainer
          width={chartWidth < 600 ? "100%" : chartWidth}
          height={280}
        >
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: 20, bottom: 5 }}
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
                offset: 0,
                style: {
                  fontSize: "18px",
                  fontWeight: 700,
                  textAnchor: "middle",
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
            {/**<Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />*/}
            <Bar dataKey="success" fill="#14bd85ff" name="Successful Txns" />
            <Bar dataKey="failed" fill="#F44336" name="Failure Txns" />
          </BarChart>
        </ResponsiveContainer>
      </div>
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
        {/* Legend Item: Successful */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: "#14bd85ff", // Must match <Bar> fill
            }}
          />
          <span style={{ fontSize: "18px", color: "var(--text-secondary)" }}>
            Successful Txns
          </span>
        </div>

        {/* Legend Item: Failure */}
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
