/**
 * services/api.js
 *
 * Single configured Axios instance for the entire app.
 *
 * - baseURL points to the Express backend (port 5000 by default)
 * - Request interceptor: attaches JWT from localStorage as Bearer token
 * - Response interceptor: on 401 (token expired / invalid) clears storage and
 *   redirects the user back to /login automatically
 */

import axios from "axios";

// ─── Base URL ────────────────────────────────────────────────────────────────

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// ─── Create Axios Instance ────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response, // pass-through successful responses unchanged
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove stale auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Hard-redirect — avoids stale React state
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
