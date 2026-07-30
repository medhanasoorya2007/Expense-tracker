/**
 * pages/Income.jsx
 *
 * Protected page for managing income records.
 *
 * API endpoints used:
 *   GET    /api/income/get            → fetch all income records
 *   POST   /api/income/add            → add new income
 *   PUT    /api/income/update/:id     → edit income (description + amount only)
 *   DELETE /api/income/delete/:id     → delete income
 *   GET    /api/income/downloadexcel  → download Excel file (blob)
 *
 * Income record fields: { _id, description, amount, category, date }
 * Note: update endpoint only accepts { description, amount }
 */

import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import IncomeCard from "../components/IncomeCard";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Chart from "../components/Chart";
import { TrendingUp, Download, Plus } from "lucide-react";
import formatCurrency from "../utils/formatCurrency";
import { groupByCategory, groupByMonth } from "../utils/chartData";

// Fixed dropdown categories for income
const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Other"];

// ── Default form values ─────────────────────────────────────────────────────
const EMPTY_FORM = {
  description: "",
  category: INCOME_CATEGORIES[0],
  amount: "",
  date: new Date().toISOString().split("T")[0], // today in YYYY-MM-DD
};

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null); // null = adding new
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Confirm-delete state
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch all incomes ──────────────────────────────────────────────────
  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/income/get");
      if (res.data.success) {
        setIncomes(res.data.incomes);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch incomes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIncomes(); }, [fetchIncomes]);

  // ── Open modal for Add ─────────────────────────────────────────────────
  function openAddModal() {
    setEditRecord(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  // ── Open modal for Edit ────────────────────────────────────────────────
  function openEditModal(income) {
    setEditRecord(income);
    setForm({
      description: income.description,
      category: income.category,
      amount: String(income.amount),
      date: income.date ? income.date.split("T")[0] : "",
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditRecord(null);
    setFormError("");
  }

  // ── Handle form input ──────────────────────────────────────────────────
  function handleChange(e) {
    setFormError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // ── Submit Add / Edit ──────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!form.description || !form.amount || !form.category || !form.date) {
      setFormError("All fields are required.");
      return;
    }
    if (isNaN(form.amount) || Number(form.amount) <= 0) {
      setFormError("Amount must be a positive number.");
      return;
    }

    setFormLoading(true);
    try {
      if (editRecord) {
        // Edit — backend only accepts description + amount
        await api.put(`/income/update/${editRecord._id}`, {
          description: form.description,
          amount: Number(form.amount),
        });
      } else {
        // Add — backend accepts description, amount, category, date
        await api.post("/income/add", {
          description: form.description,
          amount: Number(form.amount),
          category: form.category,
          date: form.date,
        });
      }
      closeModal();
      fetchIncomes();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save income.");
    } finally {
      setFormLoading(false);
    }
  }

  // ── Delete income ──────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/income/delete/${deleteId}`);
      setDeleteId(null);
      fetchIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete income.");
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Download Excel ─────────────────────────────────────────────────────
  async function handleDownload() {
    try {
      const res = await api.get("/income/downloadexcel", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download Excel file.");
    }
  }

  // ── Compute Chart Data ──────────────────────────────────────────────────
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  // Pie chart — Income by Category
  const pieData = groupByCategory(incomes);

  // Bar chart — Monthly Income
  const barData = groupByMonth(incomes, "Income");

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="page">
      {/* Header */}
      <div className="page-header page-header--row">
        <div>
          <h1 className="page-title">Income</h1>
          <p className="page-subtitle">Track all your income sources</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="summary-card summary-card--income">
        <div className="summary-card-icon">
          <TrendingUp size={24} color="#22C55E" />
        </div>
        <div>
          <div className="summary-card-label">Total Income</div>
          <div className="summary-card-amount">{formatCurrency(totalIncome)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-row">
        <div className="chart-card">
          <h2 className="chart-card-title">Income by Category</h2>
          {pieData.length === 0 ? (
            <p className="chart-empty">No data available.</p>
          ) : (
            <Chart type="pie" data={pieData} />
          )}
        </div>
        <div className="chart-card">
          <h2 className="chart-card-title">Income Trend</h2>
          {barData.length === 0 ? (
            <p className="chart-empty">No data available.</p>
          ) : (
            <Chart type="bar" data={barData} series={[{ key: "Income", color: "#22C55E" }]} />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="page-actions" style={{ marginTop: '8px' }}>
        <button
          id="income-add-btn"
          className="btn btn-income"
          onClick={openAddModal}
        >
          <Plus size={16} /> Add Income
        </button>
        <button
          id="income-download-btn"
          className="btn btn-outline"
          onClick={handleDownload}
        >
          <Download size={16} /> Download Excel
        </button>
      </div>

      {/* Error */}
      {error && <div className="page-error-banner" role="alert">{error}</div>}

      {/* List */}
      {loading ? (
        <Loader />
      ) : incomes.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-icon">💰</p>
          <p className="empty-state-text">No income records yet — add your first one!</p>
          <button className="btn btn-income" onClick={openAddModal}>
            <Plus size={16} /> Add Income
          </button>
        </div>
      ) : (
        <div className="record-list">
          {incomes.map((income) => (
            <IncomeCard
              key={income._id}
              income={income}
              onEdit={openEditModal}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editRecord ? "Edit Income" : "Add Income"}
      >
        {formError && (
          <div className="auth-error" role="alert">{formError}</div>
        )}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Description */}
          <div className="form-group">
            <label htmlFor="income-description" className="form-label">Source / Description</label>
            <input
              id="income-description"
              name="description"
              type="text"
              className="form-input"
              placeholder="e.g. Monthly salary"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category — disabled when editing (backend doesn't update it) */}
          <div className="form-group">
            <label htmlFor="income-category" className="form-label">
              Category {editRecord && <span className="form-hint">(cannot be changed)</span>}
            </label>
            <select
              id="income-category"
              name="category"
              className="form-input"
              value={form.category}
              onChange={handleChange}
              disabled={!!editRecord}
            >
              {INCOME_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="income-amount" className="form-label">Amount (₹)</label>
            <input
              id="income-amount"
              name="amount"
              type="number"
              min="1"
              className="form-input"
              placeholder="e.g. 50000"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date — disabled when editing */}
          <div className="form-group">
            <label htmlFor="income-date" className="form-label">
              Date {editRecord && <span className="form-hint">(cannot be changed)</span>}
            </label>
            <input
              id="income-date"
              name="date"
              type="date"
              className="form-input"
              value={form.date}
              onChange={handleChange}
              disabled={!!editRecord}
              required
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              id="income-form-submit"
              type="submit"
              className="btn btn-income"
              disabled={formLoading}
            >
              {formLoading
                ? "Saving…"
                : editRecord
                  ? "Save Changes"
                  : "Add Income"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation Modal ────────────────────────────────── */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete"
      >
        <p className="modal-confirm-text">
          Are you sure you want to delete this income record? This action cannot be undone.
        </p>
        <div className="modal-footer">
          <button
            className="btn btn-outline"
            onClick={() => setDeleteId(null)}
          >
            Cancel
          </button>
          <button
            id="income-confirm-delete"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Income;
