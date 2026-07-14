/**
 * main.jsx
 *
 * Entry point — mounts React, wraps the app in:
 *   - <BrowserRouter>  for React Router v6
 *   - <AuthProvider>   for global auth state (must be inside BrowserRouter
 *                      because AuthProvider uses useNavigate)
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";
import "./styles/DotGrid.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
