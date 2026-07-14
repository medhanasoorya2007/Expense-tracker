/**
 * context/AuthContext.jsx
 *
 * Provides global auth state: user object, token, and helper functions.
 *
 * Exposed values via useAuth():
 *   - user          → { id, name, email } or null
 *   - token         → JWT string or null
 *   - isAuthenticated → boolean
 *   - login(userData, tokenString) → saves to state + localStorage
 *   - logout()      → clears state + localStorage + redirects to /login
 */

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create the context
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const navigate = useNavigate();


  // Call this after a successful login or register response.
  //  userData  – { id, name, email }
  //  tokenStr  – JWT string

  function login(userData, tokenStr) {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenStr);
  }


  // Clears all auth state and sends the user to the login page.

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>;
}

// ─── Custom hook ──────────────────────────────────────────────────────────────
/**
 * useAuth() – access auth context from any component.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
