/**
 * components/ExpenseCard.jsx
 *
 * Displays a single expense record in the Expense list.
 *
 * Props:
 *   expense  {Object}   – { _id, description, amount, category, date }
 *   onEdit   {function} – called with the expense object when Edit is clicked
 *   onDelete {function} – called with expense._id when Delete is clicked
 */

import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import { motion } from "motion/react";
import formatCurrency from "../utils/formatCurrency";
import { listItemVariants } from "../utils/motionVariants";
import {
  BriefcaseBusiness,
  Laptop,
  Building2,
  TrendingUp,
  Award,
  Gift,
  RotateCcw,
  CircleEllipsis,
  BadgeIndianRupee,
  UtensilsCrossed,
  Car,
  Lightbulb,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Clapperboard,
  Plane,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Users,
  Receipt,
  House,
} from "lucide-react";

// Map category names to emoji icons
const CATEGORY_ICONS = {
  Food: <UtensilsCrossed size={20} color="#F97316" />,      // Orange
  Transport: <Car size={20} color="#3B82F6" />,             // Blue
  Housing: <House size={20} color="#8B5CF6" />,             // Purple
  Utilities: <Lightbulb size={20} color="#FACC15" />,       // Yellow
  Shopping: <ShoppingBag size={20} color="#EC4899" />,      // Pink
  Health: <HeartPulse size={20} color="#EF4444" />,         // Red
  Education: <GraduationCap size={20} color="#0EA5E9" />,   // Sky Blue
  Entertainment: <Clapperboard size={20} color="#A855F7" />,// Violet
  Travel: <Plane size={20} color="#14B8A6" />,              // Teal
  PersonalCare: <Sparkles size={20} color="#F472B6" />,    // Rose
  EMILoans: <CreditCard size={20} color="#DC2626" />,    // Dark Red
  Insurance: <ShieldCheck size={20} color="#2563EB" />,     // Blue
  Family: <Users size={20} color="#10B981" />,              // Green
  GiftsAndDonations: <Gift size={20} color="#D946EF" />,  // Magenta
  Taxes: <Receipt size={20} color="#F59E0B" />,             // Amber
  Miscellaneous: <CircleEllipsis size={20} color="#6B7280" />, // Gray
};



function ExpenseCard({ expense, onEdit, onDelete }) {
  const { _id, description, amount, category, date } = expense;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "—";

  const icon = CATEGORY_ICONS[category] ?? <BadgeIndianRupee size={20} color="#6B7280" />;

  return (
    <motion.div className="record-card record-card--expense" variants={listItemVariants}>
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
        <p className="record-card-amount record-card-amount--expense">
          -{formatCurrency(amount)}
        </p>
        <div className="record-card-actions">
          <button
            className="record-card-btn record-card-btn--edit"
            onClick={() => onEdit(expense)}
            aria-label={`Edit expense: ${description}`}
            id={`expense-edit-${_id}`}
          >
            <RiEditLine size={16} />
          </button>
          <button
            className="record-card-btn record-card-btn--delete"
            onClick={() => onDelete(_id)}
            aria-label={`Delete expense: ${description}`}
            id={`expense-delete-${_id}`}
          >
            <RiDeleteBin6Line size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ExpenseCard;
