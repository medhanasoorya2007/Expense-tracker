/**
 * pages/Dashboard.jsx
 *
 * Protected page — shown after login.
 *
 * API: GET /api/dashboard
 * Response shape:
 *   {
 *     success: true,
 *     data: {
 *       monthlyIncome, monthlyExpense, savings, savingsRate,
 *       recentTransactions: [{ ...income/expense fields, type: "income"|"expense" }],
 *       expenseDistribution: [{ category, amount, percent }]
 *     }
 *   }
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import DashboardCard from "../components/DashboardCard";
import Chart from "../components/Chart";
import formatCurrency from "../utils/formatCurrency";
import { TrendingUp, TrendingDown, Wallet, Hand, Mail, ExternalLink, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Fetch dashboard overview ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const res = await api.get("/dashboard");
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError("Failed to load dashboard data.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  // ── Derived chart data ───────────────────────────────────────────────────

  // Pie chart — Income vs Expense
  const pieData = data
    ? [
      { name: "Income", value: data.monthlyIncome },
      { name: "Expense", value: data.monthlyExpense },
    ]
    : [];

  // Bar chart — Monthly Income vs Expense (Mocked current month for now)
  const currentMonthName = new Date().toLocaleString('default', { month: 'short' });
  const barData = data ? [
    { name: currentMonthName, Income: data.monthlyIncome, Expense: data.monthlyExpense }
  ] : [];

  // Gauge chart — Savings %
  const savingsRate = data?.monthlyIncome > 0
    ? ((data.monthlyIncome - data.monthlyExpense) / data.monthlyIncome) * 100
    : 0;

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div className="page-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      {/* ── Greeting header ─────────────────────────────────────────────── */}
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.name ?? "there"} <Hand size={24} color="#111111" />
        </h1>
        <p className="page-subtitle">
          Here&rsquo;s your financial snapshot for this month.
        </p>
      </div>

      {/* ── Summary cards ────────────────────────────────────────────────── */}
      <div className="dashboard-cards">
        <DashboardCard
          title="Monthly Income"
          amount={data?.monthlyIncome}
          type="income"
          icon={<TrendingUp size={24} color="#22C55E" />}
        />
        <DashboardCard
          title="Monthly Expense"
          amount={data?.monthlyExpense}
          type="expense"
          icon={<TrendingDown size={24} color="#EF4444" />}
        />
        <DashboardCard
          title="Current Balance"
          amount={data?.savings}
          type="balance"
          icon={<Wallet size={24} color="#111111" />}
        />
      </div>

      {/* ── Charts row ───────────────────────────────────────────────────── */}
      <div className="dashboard-charts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Pie chart */}
        <div className="chart-card">
          <h2 className="chart-card-title">Income vs Expense</h2>
          {pieData.every((d) => d.value === 0) ? (
            <p className="chart-empty">No data for this month yet.</p>
          ) : (
            <Chart type="pie" data={pieData} />
          )}
        </div>

        {/* Bar chart */}
        <div className="chart-card">
          <h2 className="chart-card-title">Monthly Income vs Expense</h2>
          {barData.length === 0 ? (
            <p className="chart-empty">No data yet.</p>
          ) : (
            <Chart type="bar" data={barData} />
          )}
        </div>

        {/* Gauge chart */}
        <div className="chart-card chart-card--full" style={{ gridColumn: "1 / -1" }}>
          <h2 className="chart-card-title">Savings Rate</h2>
          <Chart type="gauge" data={savingsRate} />
        </div>
      </div>

      {/* ── Recent Transactions ──────────────────────────────────────────── */}
      <div className="recent-section">
        <div className="recent-header">
          <h2 className="recent-title">Recent Transactions</h2>
          <p className="recent-subtitle">This month&rsquo;s latest activity</p>
        </div>

        {(!data?.recentTransactions || data.recentTransactions.length === 0) ? (
          <p className="empty-state">No transactions yet this month.</p>
        ) : (
          <ul className="recent-list" role="list">
            {data.recentTransactions.slice(0, 6).map((tx) => (
              <li key={tx._id} className={`recent-item recent-item--${tx.type}`}>
                <div className="recent-item-left">
                  <span className="recent-item-icon">
                    {tx.type === "income" ? <ArrowDownToLine color="#22C55E" /> : <ArrowUpFromLine color="#EF4444" />}
                  </span>
                  <div>
                    <p className="recent-item-desc">{tx.description}</p>
                    <p className="recent-item-meta">
                      {tx.category} ·{" "}
                      {new Date(tx.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span className={`recent-item-amount recent-item-amount--${tx.type}`}>
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Quick Actions ────────────────────────────────────────────────── */}
      <div className="quick-actions">
        <button
          className="btn btn-income"
          onClick={() => navigate("/income")}
          id="dashboard-add-income-btn"
        >
          + Add Income
        </button>
        <button
          className="btn btn-expense"
          onClick={() => navigate("/expense")}
          id="dashboard-add-expense-btn"
        >
          + Add Expense
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
