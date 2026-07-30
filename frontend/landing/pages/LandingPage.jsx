/**
 * ============================================================================
 * ExpenseFlow Main Application Component (App.tsx)
 * ============================================================================
 * ARCHITECTURAL OVERVIEW:
 * - ExpenseFlow is an editorial fintech SaaS web application designed to guide
 *   users "From Every Expense to Every Achievement".
 * - Built using React components and plain CSS (without Tailwind dependencies),
 *   emphasizing responsive typography, glassmorphism headers, S-curve SVG timelines,
 *   and interactive financial dashboard mockups.
 * 
 * COMPONENT HIERARCHY:
 * 1. Navbar: Fixed top header with frosted glass blur & mobile menu drawer.
 * 2. HeroHeader: Category pill badge, main display headline, subtext & animated arrow.
 * 3. JourneyTimeline: Interactive 4-step luggage-tag timeline with S-curve SVG path.
 * 4. DashboardPreview: Realistic browser mockup with live financial widgets & currency toggles.
 * 5. StatsSection: Grid of key platform scale counters (1.2M+ transactions, $450M+ managed).
 * 6. FeatureGrid: 4 core product capability cards (Smart Expense, Budgeting, Analytics, Security).
 * 7. CtaSection: High-impact conversion section with tactile action button.
 * 8. Footer: Global legal links and copyright info.
 * 9. AuthModal & GetStartedModal: Interactive dialog popups for Log In & Savings Calculator onboarding.
 * ============================================================================
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroHeader from '../components/HeroHeader';
import FinancialJourney from '../components/FinancialJourney';
import DashboardPreview from '../components/DashboardPreview';
import StatsSection from '../components/StatsSection';
import FeatureGrid from '../components/FeatureGrid';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';
import '../styles/landing.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="app-root grid-pattern">
      {/* 1. Fixed Top Navigation Bar */}
      <Navbar 
        onOpenLogin={() => navigate('/login')}
        onOpenGetStarted={() => navigate('/register')}
      />

      {/* Main Content Sections */}
      <main className="relative pt-32 overflow-hidden">
        {/* 2. Hero Header Section */}
        <HeroHeader 
          onExploreClick={() => {
            const el = document.getElementById('solutions');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} 
        />

        {/* 3. Interactive Financial Journey Timeline Section */}
        <FinancialJourney />

        {/* 4. Interactive Browser Mockup Financial Dashboard */}
        <DashboardPreview />

        {/* 5. Key Statistics Metrics Counter Grid */}
        <StatsSection />

        {/* 6. Product Feature Summary Grid */}
        <FeatureGrid />

        {/* 7. Final Conversion CTA Banner */}
        <CtaSection 
          onOpenGetStarted={() => navigate('/register')}
        />
      </main>

      {/* 8. Global Footer */}
      <Footer />
    </div>
  );
}
