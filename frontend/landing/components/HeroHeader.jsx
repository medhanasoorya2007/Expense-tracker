import React from 'react';

/**
 * ============================================================================
 * HERO HEADER COMPONENT (HeroHeader.jsx)
 * ============================================================================
 * Component Functionality:
 * - Serves as the primary focal section at the top of the ExpenseFlow homepage.
 * - Features a category pill badge ("YOUR FINANCIAL JOURNEY"), an impactful headline,
 *   a descriptive sub-paragraph, and a floating decorative accent arrow.
 * 
 * Styling Logic:
 * - Uses responsive typography with CSS `clamp()` so the headline scales seamlessly
 *   from mobile devices up to ultra-wide desktop displays without overflow.
 * - The decorative arrow uses CSS keyframes `@keyframes floatArrow` for a smooth,
 *   floating bounce motion.
 * ============================================================================
 */
export default function HeroHeader({ onExploreClick }) {
  return (
    <header className="hero-section container">
      {/* Category Pill Badge */}
      <div className="hero-badge">
        YOUR FINANCIAL JOURNEY
      </div>

      {/* Primary Display Title */}
      <h1 className="hero-title">
        From Every Expense to <span className="highlight">Every Achievement.</span>
      </h1>

      {/* Subtitle Description */}
      <p className="hero-subtitle">
        We bridge the gap between where your money goes and where you want to be. 
        Navigate your wealth with precision and clarity.
      </p>

      {/* Floating Decorative Hand-Drawn Arrow */}
      <div className="hero-arrow-container">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2mtw_vZtwC29dydnHsjaKINX2b0UBg3jqM8O07XytwSxVag3-8K4i8qBMHDtSRkE1NzgU5xd2tNQFdEYxuTw1I3HOtC-r6IW7-r2OS-iKKvDWpsTZAGh7ALGGtqst0Uh6gkE2u7Ic8N5WQBUWlKXKkb5Z9p4Fv9qTDKh3IukxA334KjqnESTnXnOe72CPuXishG9ungQ4w9P7NpVUXUg3QOf0SSjvWEKuXdcSr8y0xuSyDpBS2uQD"
          alt="Minimalist directional arrow"
          style={{ width: '64px', height: '64px', filter: 'grayscale(100%) brightness(0)' }}
        />
      </div>
    </header>
  );
}
