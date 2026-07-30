import React from 'react';

/**
 * ============================================================================
 * STATS SECTION COMPONENT (StatsSection.jsx)
 * ============================================================================
 * Component Functionality:
 * - Highlights ExpenseFlow's key platform metrics and scale:
 *   1. 1.2M+ Transactions Tracked
 *   2. $450M+ Money Managed
 *   3. 25% Avg. Savings Achieved
 *   4. 10k+ Budgets Created
 * 
 * Styling Logic:
 * - Arranged in a 4-column responsive grid (`grid-template-columns: repeat(4, 1fr)`)
 *   that collapses down to 2 columns on tablets and 1 column on mobile phones.
 * - Cards feature smooth CSS hover elevation (`transform: translateY(-4px)`) and
 *   border highlighting for interactive user feedback.
 * ============================================================================
 */
export default function StatsSection() {
  const stats = [
    {
      id: 1,
      icon: 'sync_alt',
      value: '1.2',
      suffix: '',
      label: 'TRANSACTIONS TRACKED'
    },
    {
      id: 2,
      icon: 'payments',
      value: '450',
      prefix: '$',
      suffix: 'M+',
      label: 'MONEY MANAGED'
    },
    {
      id: 3,
      icon: 'trending_up',
      value: '25',
      suffix: '%',
      label: 'AVG. SAVINGS ACHIEVED'
    },
    {
      id: 4,
      icon: 'rule',
      value: '10',
      suffix: 'k+',
      label: 'BUDGETS CREATED'
    }
  ];

  return (
    <section className="stats-section container">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-metric-card">
            <span className="material-symbols-outlined stat-icon">
              {stat.icon}
            </span>
            <div className="stat-number">
              {stat.prefix || ''}{stat.value}{stat.suffix || ''}
            </div>
            <div className="stat-label">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
