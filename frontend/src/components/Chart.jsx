/**
 * components/Chart.jsx
 *
 *
 * Props:
 *   type  {"pie" | "bar" | "gauge"}  – which chart variant to render
 *   data  {Array}          – data array (shape differs by type)
 */

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar
} from "recharts";
import formatCurrency from "../utils/formatCurrency";

// Grayscale palette for multi-category
const GRAYSCALE = ["#111111", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#F3F4F6"];
const COLOR_INCOME = "#22C55E";
const COLOR_EXPENSE = "#EF4444";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        {label && <p className="chart-tooltip-label">{label}</p>}
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color || entry.fill }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function Chart({ type, data = [] }) {
  // ── Pie Chart ────────────────────────────────────────────────────────────
  if (type === "pie") {

    const isStrictIncomeExpense = data.length === 2 && data.some(d => d.name === "Income") && data.some(d => d.name === "Expense");

    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => {
              let color = GRAYSCALE[index % GRAYSCALE.length];
              if (isStrictIncomeExpense) {
                if (entry.name === "Income") color = COLOR_INCOME;
                if (entry.name === "Expense") color = COLOR_EXPENSE;
              }
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // ── Bar Chart ────────────────────────────────────────────────────────────
  if (type === "bar") {
    if (!data.length) return null;

    const keys = Object.keys(data[0]).filter(k => k !== "name");

    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `₹${v / 1000}k`}
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                {value}
              </span>
            )}
          />
          {keys.map((key, i) => {
            let color = GRAYSCALE[i % GRAYSCALE.length];
            if (key === "Income") color = COLOR_INCOME;
            if (key === "Expense") color = COLOR_EXPENSE;
            return <Bar key={key} dataKey={key} name={key} fill={color} radius={[6, 6, 0, 0]} />;
          })}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // ── Gauge Chart ──────────────────────────────────────────────────────────
  if (type === "gauge") {
    // Expects data format: { value: 65, label: "65%" } 
    // Wait, let's allow data to just be the percentage number, e.g. data={65}
    const percent = typeof data === "number" ? data : (data[0]?.value || 0);
    const validPercent = Math.min(Math.max(percent, 0), 100);

    // RadialBarChart needs array data. We show the fill up to percent.
    const gaugeData = [{
      name: "Savings",
      value: validPercent,
      fill: "hsla(0, 100%, 1%, 1.00)"
    }];

    return (
      <div className="gauge-wrapper" style={{ height: 280, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="75%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
            data={gaugeData}
            startAngle={180}
            endAngle={0}
          >
            {/* Background bar */}
            <RadialBar
              minAngle={15}
              background={{ fill: "var(--surface-2)" }}
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="gauge-center">
          <div className="gauge-percent">{validPercent.toFixed(0)}%</div>
          <div className="gauge-label">Saved</div>
        </div>
      </div>
    );
  }

  return null;
}

export default Chart;
