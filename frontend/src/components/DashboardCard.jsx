/**
 * components/DashboardCard.jsx
 *
 * Reusable summary card shown on the Dashboard.
 *
 * Props:
 *   title  {string}           – card heading (e.g. "Total Income")
 *   amount {number}           – numeric value to display formatted
 *   icon   {ReactNode}        – optional icon element
 *   type   {"income"|"expense"|"balance"} – drives the color accent class
 */

import formatCurrency from "../utils/formatCurrency";

function DashboardCard({ title, amount, icon, type = "balance" }) {
  return (
    <div className={`dashboard-card dashboard-card--${type}`}>
      {/* Icon bubble */}
      {icon &&
        <div className="dashboard-card-icon">
          {icon}
        </div>
      }
      {/* Text content */}
      <div className="dashboard-card-content">
        <p className="dashboard-card-title">
          {title}
        </p>
        <p className="dashboard-card-amount">
          {formatCurrency(amount ?? 0)}
        </p>
      </div>
    </div>
  );
}

export default DashboardCard;
