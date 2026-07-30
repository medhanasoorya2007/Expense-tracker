/**
 * components/Sidebar.jsx
 */
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CircleArrowUp,
  CircleArrowDown,
  UserRoundPen,
  Phone,
  LogOut,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { sidebarNavVariants, sidebarItemVariants } from '../utils/motionVariants';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/income', label: 'Income', Icon: CircleArrowUp },
  { to: '/expense', label: 'Expense', Icon: CircleArrowDown },
  { to: '/profile', label: 'Profile', Icon: UserRoundPen },
  {
    to: 'https://medhanasoorya-portfolio.vercel.app/',
    label: 'Contact Us',
    Icon: Phone,
  },
];

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <nav
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        aria-label="Main navigation"
      >
        {/* ── User info block ── */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initial}</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name}</p>
            <p className="sidebar-user-email">{user?.email}</p>
          </div>
        </div>

        <motion.ul
          className="sidebar-nav"
          role="list"
          variants={sidebarNavVariants}
          initial="hidden"
          animate="visible"
        >
          {NAV_LINKS.map(({ to, label, Icon }) => (
            <motion.li key={to} variants={sidebarItemVariants}>
              <NavLink
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                }
                id={`sidebar-link-${label.toLowerCase()}`}
              >
                <Icon className="sidebar-link-icon" size={20} />
                <span className="sidebar-link-label">{label}</span>
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>

        <div className="sidebar-footer">
          <button
            className="sidebar-logout-btn"
            onClick={() => {
              onClose();
              logout();
            }}
            id="sidebar-logout-btn"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
