import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import formatCurrency from "../utils/formatCurrency";

const GRAYSCALE = ["#111111", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#E5E7EB"];
const COLORS = { income: "#22C55E", expense: "#EF4444" };

function CustomTooltip({ active, payload, label, type, total = 0 }) {
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  const percentage = total ? Math.round((Number(entry.value) / total) * 100) : 0;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{type === "pie" ? entry.name : label}</p>
      {payload.map((item) => (
        <p key={item.dataKey || item.name} className="chart-tooltip-value" style={{ color: item.color || item.fill }}>
          {type === "pie" ? "Amount" : item.name}: {formatCurrency(item.value)}
        </p>
      ))}
      {type === "pie" && <p className="chart-tooltip-meta">{percentage}% of total</p>}
    </div>
  );
}

function Chart({ type, data = [], series = [], detail }) {
  if (!data.length && type !== "gauge") return null;

  if (type === "pie") {
    const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" innerRadius={62} outerRadius={96} paddingAngle={3} dataKey="value" nameKey="name">
            {data.map((entry, index) => <Cell key={entry.name} fill={GRAYSCALE[index % GRAYSCALE.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip type="pie" total={total} />} />
          <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: "8px" }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "gauge") {
    const percent = Math.min(Math.max(Number(data) || 0, 0), 100);
    return (
      <div className="gauge-wrapper" style={{ height: 280, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="75%" innerRadius="70%" outerRadius="100%" barSize={20} data={[{ value: percent, fill: "#111111" }]} startAngle={180} endAngle={0}>
            <RadialBar minAngle={10} background={{ fill: "var(--surface-2)" }} clockWise dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="gauge-center">
          <div className="gauge-percent">{percent.toFixed(0)}%</div>
          <div className="gauge-label">Saved{detail ? ` · ${detail}` : ""}</div>
        </div>
      </div>
    );
  }

  const chartSeries = series.length ? series : Object.keys(data[0]).filter((key) => key !== "name").map((key) => ({ key, label: key }));
  const ChartComponent = type === "line" ? LineChart : BarChart;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ChartComponent data={data} margin={{ top: 8, right: 10, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 5" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis width={52} tickFormatter={(value) => `₹${value >= 1000 ? `${value / 1000}k` : value}`} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip type={type} />} />
        {chartSeries.length > 1 && <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: "8px" }} />}
        {chartSeries.map((item, index) => {
          const color = item.color || (item.key.toLowerCase() === "income" ? COLORS.income : item.key.toLowerCase() === "expense" ? COLORS.expense : GRAYSCALE[index]);
          return type === "line" ? (
            <Line key={item.key} type="monotone" dataKey={item.key} name={item.label || item.key} stroke={color} strokeWidth={3} dot={{ r: 3, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 5 }} />
          ) : (
            <Bar key={item.key} dataKey={item.key} name={item.label || item.key} fill={color} radius={[7, 7, 0, 0]} maxBarSize={44} />
          );
        })}
      </ChartComponent>
    </ResponsiveContainer>
  );
}

export default Chart;
