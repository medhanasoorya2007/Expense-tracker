/**
 * components/IncomeCard.jsx
 *
 * Displays a single income record in the Income list.
 *
 * Props:
 *   income   {Object}   – { _id, description, amount, category, date }
 *   onEdit   {function} – called with the income object when Edit is clicked
 *   onDelete {function} – called with income._id when Delete is clicked
 */

import formatCurrency from '../utils/formatCurrency';
import {
  SquarePen,
  Trash,
  BriefcaseBusiness,
  Laptop,
  Building2,
  TrendingUp,
  Award,
  Gift,
  RotateCcw,
  CircleEllipsis,
  BadgeIndianRupee,
} from 'lucide-react';
// Map category names to emoji icons for a bit of visual personality
const CATEGORY_ICONS = {
  Salary: <BriefcaseBusiness size={20} color="#2563EB" />, // Blue
  Freelance: <Laptop size={20} color="#8B5CF6" />, // Purple
  Business: <Building2 size={20} color="#F59E0B" />, // Amber
  Investments: <TrendingUp size={20} color="#10B981" />, // Emerald
  Bonus: <Award size={20} color="#EAB308" />, // Gold
  Gifts: <Gift size={20} color="#EC4899" />, // Pink
  Refund: <RotateCcw size={20} color="#06B6D4" />, // Cyan
  Other: <CircleEllipsis size={20} color="#6B7280" />, // Gray
};

function IncomeCard({ income, onEdit, onDelete }) {
  const { _id, description, amount, category, date } = income;

  // Format the date in a readable format (e.g. "12 Jul 2026")
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  const icon = CATEGORY_ICONS[category] ?? (
    <BadgeIndianRupee size={20} color="#6B7280" />
  );

  return (
    <div className="record-card record-card--income">
      {/* Left: category icon + text */}
      <div className="record-card-left">
        <div className="record-card-icon">{icon}</div>
        <div className="record-card-info">
          <p className="record-card-description">{description}</p>
          <p className="record-card-meta">
            <span className="record-card-category">{category}</span>
            <span className="record-card-dot">·</span>
            <span className="record-card-date">{formattedDate}</span>
          </p>
        </div>
      </div>

      {/* Right: amount + action buttons */}
      <div className="record-card-right">
        <p className="record-card-amount record-card-amount--income">
          +{formatCurrency(amount)}
        </p>
        <div className="record-card-actions">
          <button
            className="record-card-btn record-card-btn--edit"
            onClick={() => onEdit(income)}
            aria-label={`Edit income: ${description}`}
            id={`income-edit-${_id}`}
          >
            <SquarePen size={16} />
          </button>
          <button
            className="record-card-btn record-card-btn--delete"
            onClick={() => onDelete(_id)}
            aria-label={`Delete income: ${description}`}
            id={`income-delete-${_id}`}
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomeCard;
