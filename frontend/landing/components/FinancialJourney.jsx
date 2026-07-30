import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from 'motion/react';
import './FinancialJourney.css';

/**
 * ============================================================================
 * TAG CARD SUB-COMPONENT
 * ============================================================================
 * Represents one step along the user's ExpenseFlow journey.
 * Uses `useMotionValueEvent` to listen to scroll progress of the animated
 * SVG timeline path and dynamically toggles the active highlight state
 * as the line tip passes through the card!
 */
const TagCard = ({
  number,
  title,
  text,
  className,
  pathLength,
  containerRef,
}) => {
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false);

  // Scroll listener: Checks line tip position relative to card container top
  useMotionValueEvent(pathLength, 'change', (latest) => {
    if (!ref.current || !containerRef.current) return;

    const cardRect = ref.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const cardTopRelativeToContainer = cardRect.top - containerRect.top;
    const containerHeight = containerRect.height;

    // Trigger activation when the line tip is 50px into the card
    const triggerY = cardTopRelativeToContainer + 50;
    const lineTipY = latest * containerHeight;

    if (lineTipY >= triggerY) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  });

  return (
    <div
      ref={ref}
      className={`fj-tag-card ${className || ''} ${isActive ? 'active' : ''}`}
    >
      {/* Luggage Tag Hole Punch Cutout */}
      <div className="fj-hole-punch">
        <div className="fj-hole-inner"></div>
      </div>

      {/* Inner Card Box */}
      <div className="fj-card-inner">
        <span className="fj-card-number">{number}</span>
        <h3 className="fj-card-title">{title}</h3>
        <p className="fj-card-text">{text}</p>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * FINANCIAL JOURNEY MAIN COMPONENT (FinancialJourney.jsx)
 * ============================================================================
 * - Replaces the original expertise section with an ExpenseFlow narrative timeline.
 * - Connects scroll position via Framer Motion `useScroll` and smooths it using `useSpring`.
 * - Reveals a curved SVG path that activates luggage tag step cards in real-time.
 */
export default function FinancialJourney() {
  const containerRef = useRef(null);

  // Framer Motion scroll tracker linked to container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // Smooth spring physics for line path extension
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  return (
    <section id="platform" ref={containerRef} className="fj-section">
      <div className="fj-container">
        {/* Header Block: Badge, Title & Narrative Description */}
        <div className="fj-header">
          <div className="fj-badge">Financial Journey</div>
          <h2 className="fj-title">
            From Every Expense to Every Achievement
            {/* Hand-drawn Directional Arrow SVG */}
            <svg
              className="fj-arrow-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 4 Q 10 10 15 15 M 15 15 L 10 15 M 15 15 L 15 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h2>
          <p className="fj-subtitle">
            Follow your financial journey with ExpenseFlow. Track every
            transaction, understand your spending habits, build better budgets,
            and reach your savings goals with confidence.
          </p>
        </div>

        {/* Desktop Animated SVG Path with Framer Motion Reveal Mask */}
        <svg
          className="fj-svg-desktop"
          viewBox="0 0 1000 1350"
          preserveAspectRatio="none"
        >
          {/* Faint Background Guide Path */}
          <path
            d="M 650,200 C 400,300 200,400 300,600 C 400,800 750,750 700,950 C 650,1150 400,1150 300,1200"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeDasharray="8 10"
          />

          {/* Mask that controls the revealed portion based on pathLength spring */}
          <mask id="path-mask">
            <motion.path
              d="M 650,200 C 400,300 200,400 300,600 C 400,800 750,750 700,950 C 650,1150 400,1150 300,1200"
              fill="none"
              stroke="white"
              strokeWidth="20"
              style={{ pathLength }}
            />
          </mask>

          {/* Revealed Solid Line Path */}
          <path
            d="M 650,200 C 400,300 200,400 300,600 C 400,800 750,750 700,950 C 650,1150 400,1150 300,1200"
            fill="none"
            stroke="#191c1d"
            strokeWidth="3"
            strokeDasharray="8 10"
            mask="url(#path-mask)"
          />
        </svg>

        {/* Mobile Animated Vertical Line */}
        <svg
          className="fj-svg-mobile"
          viewBox="0 0 4 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 2,0 L 2,100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
            strokeDasharray="4 6"
            vectorEffect="non-scaling-stroke"
          />
          <mask id="path-mask-mobile">
            <motion.path
              d="M 2,0 L 2,100"
              fill="none"
              stroke="white"
              strokeWidth="4"
              style={{ pathLength }}
              vectorEffect="non-scaling-stroke"
            />
          </mask>
          <path
            d="M 2,0 L 2,100"
            fill="none"
            stroke="#191c1d"
            strokeWidth="4"
            strokeDasharray="4 6"
            mask="url(#path-mask-mobile)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* 4 Step Tag Cards Container */}
        <div className="fj-cards-container">
          <TagCard
            number="01"
            title="Track Every Expense"
            text="Record every purchase and income effortlessly while keeping your finances organized."
            className="fj-card-1"
            pathLength={pathLength}
            containerRef={containerRef}
          />

          <TagCard
            number="02"
            title="Understand Your Spending"
            text="Visualize where your money goes through smart insights and spending analytics."
            className="fj-card-2"
            pathLength={pathLength}
            containerRef={containerRef}
          />

          <TagCard
            number="03"
            title="Plan Smarter Budgets"
            text="Create monthly budgets, monitor your progress, and stay on track with your financial goals."
            className="fj-card-3"
            pathLength={pathLength}
            containerRef={containerRef}
          />

          <TagCard
            number="04"
            title="Grow Your Savings"
            text="Turn better financial habits into meaningful savings and long-term achievements."
            className="fj-card-4"
            pathLength={pathLength}
            containerRef={containerRef}
          />

          {/* End Note */}
          <div className="fj-footer-note">Every Rupee Counts.</div>
        </div>
      </div>
    </section>
  );
}
