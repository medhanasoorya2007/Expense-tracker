import React, { useState } from 'react';
import { BarChart3, Landmark, LayoutDashboard, Plus, ReceiptText, Settings } from 'lucide-react';

/**
 * ============================================================================
 * DASHBOARD PREVIEW COMPONENT (DashboardPreview.jsx)
 * ============================================================================
 * Component Functionality:
 * - Renders a realistic browser mockup (`app.expenseflow.com/dashboard`) containing
 *   an interactive SaaS finance dashboard.
 * - Allows users to:
 *   1. Switch active currency symbol (₹ INR, $ USD, € EUR) dynamically.
 *   2. Switch between timeframes (Monthly, Quarterly, Yearly).
 *   3. Click sidebar items (Overview, Transactions, Analytics, Budgets).
 *   4. Interactively add a custom expense transaction to see live state updates!
 * 
 * Styling Logic:
 * - Employs a browser window frame with dots and address bar.
 * - Uses CSS Grid (`grid-template-columns: 200px 1fr`) for sidebar layout on desktop.
 * - Features a CSS `conic-gradient` donut chart and CSS Flexbar bar chart for clean visual data representation without third-party chart weight.
 * ============================================================================
 */
export default function DashboardPreview() {
  // State for selected currency symbol & rate multiplier
  const [currency, setCurrency] = useState('INR');
  
  // Currency metadata
  const currencies = {
    INR: { symbol: '₹', income: 85000, expense: 42300, savings: 42700, total: 124500 },
    USD: { symbol: '$', income: 8500, expense: 4230, savings: 4270, total: 12450 },
    EUR: { symbol: '€', income: 7800, expense: 3880, savings: 3920, total: 11420 }
  };

  const curr = currencies[currency];

  // State for user added transactions
  const [customExpenses, setCustomExpenses] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeframe, setTimeframe] = useState('Monthly');

  // Calculate totals including custom expenses
  const extraExpensesTotal = customExpenses.reduce((sum, item) => sum + item.amount, 0);
  const currentExpenseTotal = curr.expense + extraExpensesTotal;
  const currentSavingsTotal = curr.income - currentExpenseTotal;
  const currentBalanceTotal = curr.total - extraExpensesTotal;

  // Handler to add custom expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newCategory || !newAmount || isNaN(newAmount)) return;
    setCustomExpenses([...customExpenses, { category: newCategory, amount: Number(newAmount), id: Date.now() }]);
    setNewCategory('');
    setNewAmount('');
    setShowAddForm(false);
  };

  return (
    <section className="dashboard-section container" id="solutions">
      {/* Browser Window Mockup Container */}
      <div className="browser-mockup">
        {/* Top Browser Bar */}
        <div className="browser-header">
          <div className="browser-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="browser-url-bar">
            app.expenseflow.com/dashboard
          </div>
          {/* Currency Selector Pill */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
            {['INR', 'USD', 'EUR'].map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backgroundColor: currency === c ? 'var(--color-primary)' : 'transparent',
                  color: currency === c ? '#ffffff' : 'var(--color-on-surface-variant)'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Inner Dashboard Layout */}
        <div className="dashboard-body">
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <div className="dash-logo-placeholder"></div>
            <div 
              className={`dash-menu-item ${activeTab === 'Overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('Overview')}
            >
              <LayoutDashboard size={18} aria-hidden="true" />
              Overview
            </div>
            <div 
              className={`dash-menu-item ${activeTab === 'Transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('Transactions')}
            >
              <ReceiptText size={18} aria-hidden="true" />
              Transactions
            </div>
            <div 
              className={`dash-menu-item ${activeTab === 'Analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('Analytics')}
            >
              <BarChart3 size={18} aria-hidden="true" />
              Analytics
            </div>
            <div 
              className={`dash-menu-item ${activeTab === 'Budgets' ? 'active' : ''}`}
              onClick={() => setActiveTab('Budgets')}
            >
              <Landmark size={18} aria-hidden="true" />
              Budgets
            </div>
            <div 
              className={`dash-menu-item ${activeTab === 'Settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('Settings')}
            >
              <Settings size={18} aria-hidden="true" />
              Settings
            </div>
          </aside>

          {/* Main Dashboard Panel */}
          <main className="dash-main">
            {/* Header row */}
            <div className="dash-header-row">
              <div className="dash-title-block">
                <h4>Financial Overview</h4>
                <p>Welcome back, Sarah.</p>
              </div>
              <div className="dash-balance-block">
                <span className="balance-label">Total Balance</span>
                <span className="balance-amount">
                  {curr.symbol}{currentBalanceTotal.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Monthly', 'Quarterly', 'Yearly'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      border: '1px solid var(--color-border-subtle)',
                      backgroundColor: timeframe === tf ? 'var(--color-surface-container)' : '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <button 
                className="btn-primary" 
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus size={16} aria-hidden="true" />
                {showAddForm ? 'Cancel' : 'Add Expense'}
              </button>
            </div>

            {/* Interactive Add Expense Form */}
            {showAddForm && (
              <form onSubmit={handleAddExpense} style={{
                backgroundColor: 'var(--color-surface-container-low)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <input 
                  type="text" 
                  placeholder="Expense Category (e.g., Dining out)" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ flex: 2, padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                  required
                />
                <input 
                  type="number" 
                  placeholder={`Amount (${curr.symbol})`} 
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Save
                </button>
              </form>
            )}

            {/* Summary Stat Cards Grid */}
            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <span className="stat-card-title">Monthly Income</span>
                <span className="stat-card-value">{curr.symbol}{curr.income.toLocaleString()}</span>
                <div className="stat-progress-bar">
                  <div className="stat-progress-fill" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div className="dash-stat-card">
                <span className="stat-card-title">Monthly Expenses</span>
                <span className="stat-card-value">{curr.symbol}{currentExpenseTotal.toLocaleString()}</span>
                <div className="stat-progress-bar">
                  <div className="stat-progress-fill" style={{ width: '49%' }}></div>
                </div>
              </div>

              <div className="dash-stat-card featured">
                <span className="stat-card-title" style={{ color: 'var(--color-primary)' }}>Savings Overview</span>
                <span className="stat-card-value">{curr.symbol}{currentSavingsTotal.toLocaleString()}</span>
                <span className="stat-badge-positive">+12.5% vs Last Month</span>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="dash-charts-grid">
              {/* Donut Chart */}
              <div className="chart-card">
                <h5>Spending by Category</h5>
                <div className="donut-container">
                  <div className="donut-graphic">
                    <div className="donut-inner"></div>
                  </div>
                  <div className="legend-list">
                    <div className="legend-item">
                      <div className="legend-dot" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                      Food &amp; Drinks (45%)
                    </div>
                    <div className="legend-item">
                      <div className="legend-dot" style={{ backgroundColor: 'var(--color-on-surface-variant)' }}></div>
                      Transport (20%)
                    </div>
                    <div className="legend-item">
                      <div className="legend-dot" style={{ backgroundColor: 'var(--color-surface-dim)' }}></div>
                      Utilities (15%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="chart-card">
                <h5>Income vs Expenses</h5>
                <div className="bar-chart-container">
                  <div className="bar-group">
                    <div className="bar bg-light" style={{ height: '50%' }}></div>
                  </div>
                  <div className="bar-group">
                    <div className="bar bg-dark" style={{ height: '75%' }}></div>
                  </div>
                  <div className="bar-group">
                    <div className="bar bg-light" style={{ height: '65%' }}></div>
                  </div>
                  <div className="bar-group">
                    <div className="bar bg-dark" style={{ height: '85%' }}></div>
                  </div>
                  <div className="bar-group">
                    <div className="bar bg-light" style={{ height: '35%' }}></div>
                  </div>
                  <div className="bar-group">
                    <div className="bar bg-dark" style={{ height: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* List of Custom Added Expenses */}
            {customExpenses.length > 0 && (
              <div style={{ marginTop: '10px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px' }}>
                <h6 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>Recent Custom Transactions</h6>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {customExpenses.map((exp) => (
                    <div key={exp.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      padding: '8px 12px',
                      backgroundColor: 'var(--color-surface-container-low)',
                      borderRadius: '6px'
                    }}>
                      <span>{exp.category}</span>
                      <span style={{ fontWeight: '700', fontFamily: 'var(--font-family-mono)' }}>-{curr.symbol}{exp.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
