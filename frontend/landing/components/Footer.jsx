import React from 'react';

/**
 * ============================================================================
 * FOOTER COMPONENT (Footer.jsx)
 * ============================================================================
 * Component Functionality:
 * - Displays the global application footer with ExpenseFlow branding, legal policy
 *   hyperlinks, and copyright string.
 * 
 * Styling Logic:
 * - Border-top division line (`1px solid var(--color-border-subtle)`).
 * - Flexbox layout (`justify-content: space-between`) with responsive wrapping
 *   for smaller mobile viewports.
 * ============================================================================
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        {/* Brand Name */}
        <div className="brand-logo" style={{ fontSize: '1.1rem' }}>
          ExpenseFlow
        </div>

        {/* Footer Legal Links */}
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Security</a>
          <a href="#" className="footer-link">Status</a>
        </div>

        {/* Copyright Notice */}
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} ExpenseFlow. Precision through Clarity.
        </div>
      </div>
    </footer>
  );
}
