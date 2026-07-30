import React from 'react';

/**
 * ============================================================================
 * FEATURE GRID COMPONENT (FeatureGrid.jsx)
 * ============================================================================
 * Component Functionality:
 * - Highlights the 4 core product capabilities of ExpenseFlow:
 *   1. Smart Expense Tracking
 *   2. Budget Planning
 *   3. Real-Time Analytics
 *   4. Secure Data Management
 * 
 * Styling Logic:
 * - Nested within a rounded background container (`features-container`) with
 *   light gray background tone (`rgba(237, 238, 239, 0.4)`).
 * - Utilizes a 2-column CSS Grid layout (`grid-template-columns: repeat(2, 1fr)`)
 *   with white cards (`feature-card`) that elevate slightly on mouse hover.
 * ============================================================================
 */
export default function FeatureGrid() {
  const features = [
    {
      id: 1,
      icon: 'auto_graph',
      title: 'Smart Expense Tracking',
      description: 'Automatically capture every expense from connected accounts and categorize them using advanced AI algorithms.'
    },
    {
      id: 2,
      icon: 'calendar_today',
      title: 'Budget Planning',
      description: 'Create dynamic budgets that adjust to your spending patterns and alert you before you reach your limits.'
    },
    {
      id: 3,
      icon: 'monitoring',
      title: 'Real-Time Analytics',
      description: 'Visualize your net worth, cash flow, and investment performance with stunning interactive dashboards.'
    },
    {
      id: 4,
      icon: 'security',
      title: 'Secure Data Management',
      description: 'Bank-grade encryption ensures your data stays private and protected at all times. Your privacy is our priority.'
    }
  ];

  return (
    <section className="features-section container" id="resources">
      <div className="features-container">
        {/* Section Header */}
        <div className="features-header">
          <h2>Everything You Need to Stay in Control</h2>
          <p>One platform, endless possibilities for your financial growth.</p>
        </div>

        {/* 2-Column Cards Grid */}
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon-box">
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  {feature.icon}
                </span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
