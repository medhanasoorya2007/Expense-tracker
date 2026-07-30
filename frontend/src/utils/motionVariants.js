/**
 * utils/motionVariants.js
 *
 * Shared, reusable Framer Motion animation variants.
 * Kept minimal and professional — Linear / Vercel dashboard style.
 */

// ── Page-level fade + small upward slide ────────────────────────────────────
export const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
};

// ── Card entrance — used for dashboard summary cards ────────────────────────
export const cardVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
};

// ── Staggered list container ────────────────────────────────────────────────
export const listContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
    },
  },
};

// ── Individual list item ─────────────────────────────────────────────────────
export const listItemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
  },
};

// ── Modal overlay fade ───────────────────────────────────────────────────────
export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.14, ease: "easeIn" } },
};

// ── Modal box — subtle scale + fade ─────────────────────────────────────────
export const modalBoxVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 4,
    transition: { duration: 0.14, ease: "easeIn" },
  },
};

// ── Navbar dropdown — fade + small downward slide ────────────────────────────
export const dropdownVariants = {
  hidden: { opacity: 0, y: -4, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

// ── Sidebar nav — stagger container ─────────────────────────────────────────
export const sidebarNavVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

// ── Sidebar nav item ─────────────────────────────────────────────────────────
export const sidebarItemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
};

// ── Button hover / tap (apply directly to motion.button props) ───────────────
export const buttonTap = { scale: 0.98 };
export const buttonHover = { scale: 1.02 };
