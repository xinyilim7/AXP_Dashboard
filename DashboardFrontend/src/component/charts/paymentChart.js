import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Cell,
} from "recharts";
import ChartWrapper from "./chartWrapper";

const RED_THEME_COLORS = [
  "#800808ff",
  "#a41e1eff",
  "#cc2a1eff",
  "#de4a4aff",
  "#dd5a67ff",
];

const formatCurrency = (value) => {
  if (value > 1000) {
    return `RM ${(value / 1000).toLocaleString("en-US", {
      // format into 1 decimal point
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}k`;
  }
  return `RM ${value.toLocaleString("en-US", {
    // format into no decimal point
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const formatVolume = (value) => {
  return value.toLocaleString("en-US");
};

export function PaymentMethodChart({
  data,
  loading,
  title,
  error,
  icon,
  headerActions,
  currentSortKey,
}) {
  const isInitialLoading = loading && (!data || data.length === 0);
  const dataFormatter =
    currentSortKey === "amount" ? formatCurrency : formatVolume;

  const chartData = data || [];

  return (
    <ChartWrapper
      title={title}
      loading={isInitialLoading}
      error={error}
      icon={icon}
      headerActions={headerActions}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 200, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <YAxis
            dataKey="category"
            type="category"
            value="Payment Method"
            width={120}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 18, fontWeight:700, fill: "var(--text-muted)" }}
            dx={-10}
          />
          <XAxis
            type="number"
            tickFormatter={dataFormatter}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--text-muted)" }}
          >
            <Label
              value={
                currentSortKey === "amount"
                  ? "Total Amount (MYR)"
                  : "Total Volume"
              }
              position="insideBottom"
              dy={20}
              style={{ fontWeight: 700, fontSize:18, fill: "var(--text-muted" }}
            />
          </XAxis>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--accent)",
              borderRadius: "8px",
            }}
            labelStyle={{ 
              color: "var(--text-main)",
              fontWeight: 700
            }}
            itemStyle={{ 
              color: "var(--text-main)" 
            }}
          />
          <Bar
            dataKey={currentSortKey} // amount or volume
            radius={[0, 4, 4, 0]}
            barSize={20}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={RED_THEME_COLORS[index % RED_THEME_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export default PaymentMethodChart;
