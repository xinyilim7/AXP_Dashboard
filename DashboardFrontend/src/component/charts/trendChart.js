import { useRef, useEffect } from "react"; 
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import ChartWrapper from "./chartWrapper"; 

export function TrendChart({
  data=[],
  loading,
  error,
  icon,
  dateRange,
  headerActions,
}) {
  const isInitialLoading = loading && (!data || data.length === 0);
  const title = `Transaction Status Trend (${dateRange})`;

  const isDaily = dateRange === "Daily";
  const chartData = data; 

  const xAxisKey = isDaily ? "minute" : "label";
  const scrollContainerRef = useRef(null);
  const barWidth = 40;
  const chartWidth = isDaily ? chartData.length * barWidth : "100%";

  useEffect(() => {
    // Only auto-scroll on daily view and if the ref is ready
    if (isDaily && scrollContainerRef.current && chartData.length > 0) {
      const now = new Date();
      // Get the current minute of the day
      const currentMinute = now.getHours() * 60 + now.getMinutes();
      // Get container width to center the scroll
      const containerWidth = scrollContainerRef.current.offsetWidth;
      // Calculate scroll position to center the current time
      let scrollPos = currentMinute * barWidth - containerWidth / 2;
      // Don't scroll past the beginning
      if (scrollPos < 0) {
        scrollPos = 0;
      }
      // Scroll immediately on load
      scrollContainerRef.current.scrollTo({
        left: scrollPos,
        behavior: "auto", 
      });
    }
  }, [isDaily, chartData, barWidth]); 
  
  
  const ChartContent = () => (
    <ResponsiveContainer width={chartWidth} height={350}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }} 
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
         
          interval={0}
          tick={{
            fill: "var(--text-muted)",
            fontSize: isDaily ? 14 : 16,
            dy: 10, 
            angle: isDaily? -45: 0,
          }}
        >
          <Label
            value={
              isDaily
                ? "Time (Per Minute)"
                : dateRange === "Weekly"
                ? "Day of Week"
                : "Date"
            }
            position="insideBottom"
            dy={28}
            style={{ fontWeight:700, fill: "var(--text-muted)" }}
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
              fontWeight: 700,
            },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--accent)",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "var(--text-main)", fontWeight: 700 }}
          itemStyle={{ color: "var(--text-main)" }}
        />

        <Line
          type="monotone"
          dataKey="success"
          stroke="#14bd85ff"
          strokeWidth={isDaily ? 2 : 3.5} 
          name="Successful Txns"
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="failed"
          stroke="#F44336"
          strokeWidth={1}
          name="Failure Txns"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <ChartWrapper
      title={title}
      loading={isInitialLoading}
      error={error}
      icon={icon}
      headerActions={headerActions}
    >
      {isDaily ? (
        <div
          ref={scrollContainerRef}
          style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
        >
          <ChartContent />
        </div>
      ) : (
        <div style={{ width: "100%", height: 350 }}>
          <ChartContent />
        </div>
      )}

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