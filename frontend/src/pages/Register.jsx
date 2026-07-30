/**
 * pages/Register.jsx
 *
 * Public registration page.
 * - Calls POST /api/user/register
 * - Client-side validation: required fields, passwords match, ≥8 chars
 * - On success → redirect to /login (user must sign in explicitly)
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import api from "../services/api";
import { CircleUserRound } from "lucide-react";
import DotGrid from "../styles/DotGrid";
import { pageVariants } from "../utils/motionVariants";

function Register() {
  const navigate = useNavigate();

  // ── Form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleChange(e) {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ── Client-side validation ──
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // POST /api/user/register → { success, token, user }
      const res = await api.post("/user/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        setSuccess("Account created! Redirecting to login…");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
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
      {/* Foreground content */}
      <div className="auth-page-content">
        <div className="auth-card">
          {/* Brand */}
          <span className="auth-brand-icon"><CircleUserRound size={40} /></span>
          <div className="auth-brand">
            <h1 className="auth-brand-name">Expense Tracker</h1>
          </div>

          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Start tracking your finances today</p>

          {/* Feedback banners */}
          {error && <div className="auth-error" role="alert">{error}</div>}
          {success && <div className="auth-success" role="status">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Name */}
            <div className="form-group">
              <label htmlFor="register-name" className="form-label">Full name</label>
              <input
                id="register-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="register-email" className="form-label">Email address</label>
              <input
                id="register-email"
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
              <label htmlFor="register-password" className="form-label">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="register-confirm" className="form-label">Confirm password</label>
              <input
                id="register-confirm"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Register;
