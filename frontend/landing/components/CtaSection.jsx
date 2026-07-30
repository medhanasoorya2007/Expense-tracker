import React from 'react';
import { MoveRight } from 'lucide-react';
/**
 * ============================================================================
 * CTA SECTION COMPONENT (CtaSection.jsx)
 * ============================================================================
 * Component Functionality:
 * - Acts as the bottom call-to-action banner driving user signup.
 * - Displays a bold conversion header ("Take Control of Every Rupee") and
 *   an interactive magnetic CTA button ("Start Tracking Free").
 *
 * Styling Logic:
 * - Uses large responsive typography for maximum visual gravity.
 * - Button includes CSS keyframes and hover transitions to give a tactile, magnetic feel.
 * ============================================================================
 */
export default function CtaSection({ onOpenGetStarted }) {
  return (
    <section className="cta-section container" id="pricing">
      <h2 className="cta-title">Take Control of Every Rupee</h2>
      <p className="cta-desc">
        Track smarter, spend wiser, and grow your savings with ExpenseFlow.
        Start your journey today.
      </p>

      <button className="btn-cta-large" onClick={onOpenGetStarted}>
        Start Tracking Free
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '20px' }}
        >
          <MoveRight />
        </span>
      </button>
    </section>
  );
}
