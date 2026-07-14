//formatCurrency.js
// Helper to format a number as Indian Rupee currency string.
// formatCurrency(25000) → "₹25,000"
export function formatCurrency(amount) {
  // Guard against null / undefined / NaN
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default formatCurrency;
