import { useRef, useEffect, useMemo, useState } from "react";
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
import { AlertTriangle , X} from "lucide-react";

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
  const isDaily = dateRange === "Daily";

  const chartData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const [showAlert, setShowAlert] = useState(true);

  // --- ALERT LOGIC ---
  const { successTotal, failedTotal, successRate, failedRate, isCritical } = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    
    if (safeData.length === 0) {
      return { successTotal: 0, failedTotal: 0, successRate: 0, failedRate: 0, isCritical: false };
    }

    const success = safeData.reduce((acc, cur) => acc + (cur.success || 0), 0);
    const failed = safeData.reduce((acc, cur) => acc + (cur.failed || 0), 0);
    const total = success + failed;
    const fRate = total > 0 ? ((failed / total) * 100).toFixed(2) : 0;

    return {
      successTotal: success,
      failedTotal: failed,
      successRate: total > 0 ? ((success / total) * 100).toFixed(2) : 0,
      failedRate: fRate,
      isCritical: parseFloat(fRate) > 20 && total > 10, // Failure Rate > 20% show alert
    };
  }, [data]);

  const scrollContainerRef = useRef(null);
  const barWidth = 40;
  const chartWidth = isDaily ? chartData.length * barWidth : "100%";

  useEffect(() => {
    if (isDaily && scrollContainerRef.current && chartData.length > 0) {
      const now = new Date();
      const currentMinute = now.getHours() * 60 + now.getMinutes();
      const containerWidth = scrollContainerRef.current.offsetWidth;
      let scrollPos = currentMinute * barWidth - containerWidth / 2;
      if (scrollPos < 0) scrollPos = 0;

      scrollContainerRef.current.scrollTo({
        left: scrollPos,
        behavior: "auto",
      });
    }
  }, [isDaily, chartData, barWidth]);

  const dailyCommonMargin = { top: 20, right: 30, left: 20, bottom: 40 };

  const renderDailyYAxis = (hide) => (
    <YAxis
      hide={hide}
      allowDecimals={false}
      tickFormatter={(value) => value.toLocaleString()}
      width={60}
      tick={{ fill: "var(--text-muted)", fontSize: 14 }}
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
  );

  const renderDailyLines = (visible) => (
    <>
      <Line
        type="linear"
        dataKey="success"
        stroke={visible ? "#14bd85ff" : "none"}
        strokeWidth={2}
        name="Successful Txns"
        dot={false}
        isAnimationActive={false}
      />
      <Line
        type="linear"
        dataKey="failed"
        stroke={visible ? "#F44336" : "none"}
        strokeWidth={1}
        name="Failure Txns"
        dot={false}
        isAnimationActive={false}
      />
    </>
  );

  return (
    <ChartWrapper
      title={title}
      loading={isInitialLoading}
      error={error}
      icon={icon}
      headerActions={headerActions}
    >
      {/* =========================================================
          STATUS CARDS 
         ========================================================= */}
         {isCritical && showAlert && (
        <div className="chart-popup-alert">
          <AlertTriangle size={25} />
          <span>Warning: High Failure Rate Detected ({failedRate}%)</span>
          <button onClick={() => setShowAlert(false)} className="alert-close-btn">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="status-summary-container">
        {/* Success Group */}
        <div className="status-group">
          <div className="status-header success">
            <span>Success Transaction</span>
          </div>
          <div className="status-value-row">
            <span className="status-number">
              {successTotal.toLocaleString()}
            </span>
            <span className="status-percentage">({successRate}%)</span>
          </div>
        </div>

        {/* Failed Group */}
        <div className="status-group">
          <div className="status-header failed">
            <span>Failed Transaction</span>
          </div>
          <div className="status-value-row">
            <span className="status-number">
              {failedTotal.toLocaleString()}
            </span>
            <span className="status-percentage">({failedRate}%)</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          DAILY VIEW
         ========================================================= */}
      {isDaily ? (
        <div style={{ display: "flex", height: 350, width: "100%" }}>
          {/* FIXED Y-AXIS */}
          <div
            style={{
              width: "100px",
              flexShrink: 0,
              backgroundColor: "var(--card-bg)",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={dailyCommonMargin}>
                {renderDailyYAxis(false)}
                <XAxis dataKey="minute" hide />
                {renderDailyLines(false)}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* SCROLLING CONTENT */}
          <div
            ref={scrollContainerRef}
            style={{ flexGrow: 1, overflowX: "auto", overflowY: "hidden" }}
          >
            <div style={{ width: chartWidth, height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={dailyCommonMargin}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="minute"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tick={{
                      fill: "var(--text-muted)",
                      fontSize: 14,
                      dy: 10,
                      angle: -45,
                    }}
                  >
                    <Label
                      value="Time (Per Minute)"
                      position="insideBottom"
                      dy={28}
                      style={{ fontWeight: 700, fill: "var(--text-muted)" }}
                    />
                  </XAxis>

                  {renderDailyYAxis(true)}

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--accent)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "var(--text-main)", fontWeight: 700 }}
                    itemStyle={{ color: "var(--text-main)" }}
                  />

                  {renderDailyLines(true)}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        // WEEKLY & MONTHLY SPLIT VIEW
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{
                  fill: "var(--text-muted)",
                  fontSize: 16,
                  dy: 10,
                  angle: 0,
                }}
              >
                <Label
                  value={dateRange === "Weekly" ? "Day of Week" : "Date"}
                  position="insideBottom"
                  dy={28}
                  style={{ fontWeight: 700, fill: "var(--text-muted)" }}
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
                type="linear"
                dataKey="success"
                stroke="#14bd85ff"
                strokeWidth={3.5}
                name="Successful Txns"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="linear"
                dataKey="failed"
                stroke="#F44336"
                strokeWidth={1}
                name="Failure Txns"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* LEGEND (Bottom) */}
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
