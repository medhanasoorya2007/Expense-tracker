/**
 * pages/Profile.jsx
 *
 * Protected profile page.
 *
 * API endpoints used:
 *   GET /api/user/me              → get current user profile
 *   PUT /api/user/profile         → update name + email  { name, email }
 *   PUT /api/user/password        → change password      { currentPassword, newPassword }
 *
 * Response shapes:
 *   /me           → { success, user: { name, email } }
 *   /profile      → { success, user: { name, email } }
 *   /password     → { success, message }
 */

import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

function Profile() {
  const { user: ctxUser, login, token, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit profile state
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Change password state
  const [pwMode, setPwMode] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // ── Fetch profile ────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await api.get("/user/me");
        if (res.data.success) {
          setProfile(res.data.user);
          setEditForm({ name: res.data.user.name, email: res.data.user.email });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // ── Update profile ───────────────────────────────────────────────────
  async function handleEditSubmit(e) {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    if (!editForm.name || !editForm.email) {
      setEditError("Name and email are required.");
      return;
    }
    setEditLoading(true);
    try {
      const res = await api.put("/user/profile", editForm);
      if (res.data.success) {
        const updated = res.data.user;
        setProfile(updated);
        setEditForm({ name: updated.name, email: updated.email });
        // Sync AuthContext so Navbar shows updated name
        login(
          { id: ctxUser?.id, name: updated.name, email: updated.email },
          token
        );
        setEditSuccess("Profile updated successfully!");
        setEditMode(false);
      } else {
        setEditError(res.data.message || "Update failed.");
      }
    } catch (err) {
      setEditError(err.response?.data?.message || "Update failed.");
    } finally {
      setEditLoading(false);
    }
  }

  // ── Change password ──────────────────────────────────────────────────
  async function handlePwSubmit(e) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwError("All password fields are required.");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwLoading(true);
    try {
      const res = await api.put("/user/password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      if (res.data.success) {
        setPwSuccess("Password changed successfully!");
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPwMode(false);
      } else {
        setPwError(res.data.message || "Password change failed.");
      }
    } catch (err) {
      setPwError(err.response?.data?.message || "Password change failed.");
    } finally {
      setPwLoading(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────
  if (loading) return <Loader fullPage />;

  if (error) {
    return <div className="page-error"><p>{error}</p></div>;
  }



  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account settings</p>
      </div>

      {/* Global success messages */}
      {editSuccess && <div className="auth-success" role="status">{editSuccess}</div>}
      {pwSuccess && <div className="auth-success" role="status">{pwSuccess}</div>}

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="profile-layout">

        {/* ── Left column: Profile Card ──────────────────────────────── */}
        <div className="profile-card">
          <div className="profile-avatar">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{profile?.name}</h2>
            <p className="profile-email">{profile?.email}</p>
          </div>
        </div>

        {/* ── Right column: Edit Profile + Change Password (stacked) ──── */}
        <div className="profile-right-col">

          {/* Edit Profile Section */}
          <div className="profile-section">
            <div className="profile-section-header">
              <h3 className="profile-section-title">Edit Profile</h3>
              {!editMode && (
                <button
                  id="profile-edit-btn"
                  className="btn btn-outline"
                  onClick={() => { setEditMode(true); setPwMode(false); }}
                >
                  Edit
                </button>
              )}
            </div>

            {editMode && (
              <form onSubmit={handleEditSubmit} className="profile-form" noValidate>
                {editError && <div className="auth-error" role="alert">{editError}</div>}

                <div className="form-group">
                  <label htmlFor="profile-name" className="form-label">Full name</label>
                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={editForm.name}
                    onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-email" className="form-label">Email address</label>
                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={editForm.email}
                    onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => { setEditMode(false); setEditError(""); }}
                  >
                    Cancel
                  </button>
                  <button
                    id="profile-save-btn"
                    type="submit"
                    className="btn btn-primary"
                    disabled={editLoading}
                  >
                    {editLoading ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Change Password Section */}
          <div className="profile-section">
            <div className="profile-section-header">
              <h3 className="profile-section-title">Change Password</h3>
              {!pwMode && (
                <button
                  id="profile-change-pw-btn"
                  className="btn btn-outline"
                  onClick={() => { setPwMode(true); setEditMode(false); }}
                >
                  Change
                </button>
              )}
            </div>

            {pwMode && (
              <form onSubmit={handlePwSubmit} className="profile-form" noValidate>
                {pwError && <div className="auth-error" role="alert">{pwError}</div>}

                <div className="form-group">
                  <label htmlFor="profile-current-pw" className="form-label">Current password</label>
                  <input
                    id="profile-current-pw"
                    name="currentPassword"
                    type="password"
                    className="form-input"
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-new-pw" className="form-label">New password</label>
                  <input
                    id="profile-new-pw"
                    name="newPassword"
                    type="password"
                    className="form-input"
                    placeholder="Min. 8 characters"
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-confirm-pw" className="form-label">Confirm new password</label>
                  <input
                    id="profile-confirm-pw"
                    name="confirmPassword"
                    type="password"
                    className="form-input"
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => { setPwMode(false); setPwError(""); }}
                  >
                    Cancel
                  </button>
                  <button
                    id="profile-update-pw-btn"
                    type="submit"
                    className="btn btn-primary"
                    disabled={pwLoading}
                  >
                    {pwLoading ? "Updating…" : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Logout Section */}
          <div className="profile-section">
            <div className="profile-section-header">
              <h3 className="profile-section-title">Account</h3>
              <button
                id="profile-logout-btn"
                className="btn btn-danger"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>

        </div>
        {/* End right column */}

      </div>
      {/* End profile-layout */}
    </div>
  );
}

export default Profile;

