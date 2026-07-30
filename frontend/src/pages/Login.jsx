/**
 * pages/Login.jsx
 *
 * Public login page.
 * - Calls POST /api/user/login
 * - On success → stores token/user via AuthContext.login() → redirects to Dashboard
 * - Shows inline error messages on failure
 */

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CircleUserRound } from 'lucide-react';
import DotGrid from "../styles/DotGrid";
import { pageVariants } from "../utils/motionVariants";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to where the user was trying to go, or default to /dashboard
  const from = location.state?.from?.pathname ?? "/dashboard";

  // ── Form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleChange(e) {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic client-side check
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      // POST /api/user/login → { success, token, user: { id, name, email } }
      const res = await api.post("/user/login", {
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate(from, { replace: true });
      } else {
        setError(res.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <motion.div className="auth-page" variants={pageVariants} initial="hidden" animate="visible">
      {/* Background layer */}
      <div className="auth-page-bg">
        <DotGrid
          dotSize={8}
          gap={20}
          baseColor="#E5E7EB"
          activeColor="#111111"
          proximity={100}
          shockRadius={100}
          shockStrength={1}
          resistance={100}
          returnDuration={3.5}
        />
      </div>
      <div className="auth-page-content">
        <div className="auth-card">
          {/* Brand */}
          <span className="auth-brand-icon"><CircleUserRound size={40} /></span>
          <div className="auth-brand">
            <h1 className="auth-brand-name">Expense Tracker</h1>
          </div>

          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account</p>

          {/* Error banner */}
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            Don&rsquo;t have an account?{" "}
            <Link to="/register" className="auth-link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
