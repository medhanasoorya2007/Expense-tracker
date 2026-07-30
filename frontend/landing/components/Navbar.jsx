import React, { useState } from 'react';

/**
 * ============================================================================
 * NAVBAR COMPONENT (Navbar.jsx)
 * ============================================================================
 * Component Functionality:
 * - Renders the fixed top navigation bar for ExpenseFlow.
 * - Displays brand logo, main navigation links (Platform, Solutions, Resources, Pricing),
 *   and action buttons for "Log In" and "Get Started".
 * - Provides a responsive mobile hamburger drawer toggle for small screen devices.
 * 
 * Styling Logic:
 * - Positioned fixed at `top: 0` with `z-index: 1000` so it stays pinned as user scrolls.
 * - Uses `backdrop-filter: blur(16px)` in plain CSS to create a modern frosted glass header.
 * - Uses Flexbox (`display: flex`, `justify-content: space-between`) for clean edge-to-edge layout.
 * ============================================================================
 */
export default function Navbar({ onOpenLogin, onOpenGetStarted }) {
  // Local React state to keep track of whether the mobile navigation drawer is open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo & Icon */}
        <a href="#" className="brand-logo" aria-label="ExpenseFlow Home">
          <div className="brand-icon-box">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>account_balance_wallet</span>
          </div>
          ExpenseFlow
        </a>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li><a href="#platform" className="nav-link">Platform</a></li>
          <li><a href="#solutions" className="nav-link">Solutions</a></li>
          <li><a href="#resources" className="nav-link">Resources</a></li>
          <li><a href="#pricing" className="nav-link">Pricing</a></li>
        </ul>

        {/* Action Buttons (Desktop) */}
        <div className="nav-actions">
          <button className="btn-secondary" onClick={onOpenLogin}>
            Log In
          </button>
          <button className="btn-primary" onClick={onOpenGetStarted}>
            Get Started
          </button>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer open">
          <a href="#platform" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Platform</a>
          <a href="#solutions" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Solutions</a>
          <a href="#resources" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Resources</a>
          <a href="#pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}>
              Log In
            </button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setMobileMenuOpen(false); onOpenGetStarted(); }}>
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
