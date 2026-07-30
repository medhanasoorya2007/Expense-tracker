/**
 * App.jsx
 *
 * Root component — sets up React Router routes and the dashboard shell layout.
 *
 * Route map:
 *   Public:
 *     /login      → <Login />
 *     /register   → <Register />
 *
 *   Protected (require auth):
 *     /dashboard  → <Dashboard />
 *     /income     → <Income />
 *     /expense    → <Expense />
 *     /profile    → <Profile />
 *
 *   Fallback:
 *     *           → <NotFound />
 *
 * Layout for protected routes:
 *   <Navbar>   ← fixed top bar
 *   <Sidebar>  ← collapsible left nav
 *   <main>     ← page content area
 */

import { useState } from "react";
import { Routes, Route, Navigate, } from "react-router-dom";

import LandingPage from "../landing/pages/LandingPage";

// Layout components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// ── Dashboard shell layout (wraps all protected pages) ─────────────────────
function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Top navbar — passes the toggle callback */}
      <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

      {/* Sidebar + main content side-by-side */}
      <div className="app-body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}

// ── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── Landing Page ── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Protected routes — wrapped in DashboardLayout ── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/income"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Income />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expense"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Expense />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ── 404 fallback ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
