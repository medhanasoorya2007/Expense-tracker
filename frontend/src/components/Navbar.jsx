// ===============================
// Navbar Component
// Displays:
// - App logo & current page title
// - User avatar
// - Profile & Logout dropdown
// ===============================

import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Wallet, User, LogOut, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { dropdownVariants } from "../utils/motionVariants";


// Route → Page title mapping
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/income": "Income",
  "/expense": "Expense",
  "/profile": "Profile",
};

function Navbar({ onMenuToggle }) {

  // Auth & Navigation

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();


  // open        -> Controls dropdown visibility
  // dropdownRef -> Detects clicks outside dropdown

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Current page title based on route
  const pageTitle = PAGE_TITLES[location.pathname] || "";

  // First letter of user's name for avatar
  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";


  // Close dropdown when user clicks
  // anywhere outside the dropdown

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">


      {/* Left Section
          Logo + Current Page Title */}

      <div className="navbar-left">
        <button
          type="button"
          className="navbar-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-logo">
          <Wallet size={20} />
          <span>Expense Tracker</span>
        </div>

        <div className="navbar-divider" />
        <span className="navbar-page-title">
          {pageTitle}
        </span>
      </div>

      {/* Right Section */}
      <div
        className="navbar-avatar-wrapper"
        ref={dropdownRef}
      >
        {/* User Avatar */}
        <div className="navbar-avatar" onClick={() => setOpen((prev) => !prev)}>
          {initial}
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="navbar-dropdown"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >

              {/* User Information */}
              <div className="navbar-dropdown-header">
                <p className="navbar-dropdown-name">
                  {user?.name}
                </p>

                <p className="navbar-dropdown-email">
                  {user?.email}
                </p>
              </div>

              {/* Navigate to Profile */}
              <div
                className="navbar-dropdown-item"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
              >
                <User size={16} />
                <span>Profile</span>
              </div>

              {/* Logout User */}
              <div
                className="navbar-dropdown-item navbar-dropdown-item--danger"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </nav>
  );
}

export default Navbar;