/**
 * pages/Expense.jsx
 *
 * Protected page for managing expense records.
 *
 * API endpoints used:
 *   GET    /api/expense/get            → fetch all expenses
 *   POST   /api/expense/add            → add new expense
 *   PUT    /api/expense/update/:id     → edit expense (description + amount only)
 *   DELETE /api/expense/delete/:id     → delete expense
 *   GET    /api/expense/downloadexcel  → download Excel file (blob)
 *
 * Expense record fields: { _id, description, amount, category, date }
 * Note: update endpoint only accepts { description, amount }
 */

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import api from "../services/api";
import ExpenseCard from "../components/ExpenseCard";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Chart from "../components/Chart";
import { TrendingDown, Download, Plus, BadgeIndianRupee } from "lucide-react";
import formatCurrency from "../utils/formatCurrency";
import { groupByCategory, groupByMonth } from "../utils/chartData";
import { pageVariants, listContainerVariants } from "../utils/motionVariants";

// Fixed dropdown categories for expenses
const EXPENSE_CATEGORIES = ["Food", "Travel", "Housing", "Utilities", "Shopping", "Health", "Education", "Entertainment", "PersonalCare", "EMILoans", "Insurance", "Family", "GiftsAndDonations", "Taxes", "Miscellaneous"];

// ── Default form values ─────────────────────────────────────────────────────
const EMPTY_FORM = {
  description: "",
  category: EXPENSE_CATEGORIES[0],
  amount: "",
  date: new Date().toISOString().split("T")[0],
};

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Confirm-delete state
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch all expenses ─────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/expense/get");
      if (res.data.success) {
        setExpenses(res.data.expenses);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // ── Modal helpers ──────────────────────────────────────────────────────
  function openAddModal() {
    setEditRecord(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(expense) {
    setEditRecord(expense);
    setForm({
      description: expense.description,
      category: expense.category,
      amount: String(expense.amount),
      date: expense.date ? expense.date.split("T")[0] : "",
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditRecord(null);
    setFormError("");
  }

  // ── Form input handler ─────────────────────────────────────────────────
  function handleChange(e) {
    setFormError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // ── Submit Add / Edit ──────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

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
        // Backend update only accepts description + amount
        await api.put(`/expense/update/${editRecord._id}`, {
          description: form.description,
          amount: Number(form.amount),
        });
      } else {
        await api.post("/expense/add", {
          description: form.description,
          amount: Number(form.amount),
          category: form.category,
          date: form.date,
        });
      }
      closeModal();
      fetchExpenses();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save expense.");
    } finally {
      setFormLoading(false);
    }
  }

  // ── Delete expense ─────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/expense/delete/${deleteId}`);
      setDeleteId(null);
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete expense.");
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Download Excel ─────────────────────────────────────────────────────
  async function handleDownload() {
    try {
      const res = await api.get("/expense/downloadexcel", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download Excel file.");
    }
  }

  // ── Compute Chart Data ──────────────────────────────────────────────────
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Pie chart — Expense by Category
  const pieData = groupByCategory(expenses);

  // Bar chart — Monthly Expense
  const barData = groupByMonth(expenses, "Expense");

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <motion.div className="page" variants={pageVariants} initial="hidden" animate="visible">
      {/* Header */}
      <div className="page-header page-header--row">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track where your money goes</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="summary-card summary-card--expense">
        <div className="summary-card-icon">
          <TrendingDown size={24} color="#EF4444" />
        </div>
        <div>
          <div className="summary-card-label">Total Expense</div>
          <div className="summary-card-amount">{formatCurrency(totalExpense)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-row">
        <div className="chart-card">
          <h2 className="chart-card-title">Expense by Category</h2>
          {pieData.length === 0 ? (
            <p className="chart-empty">No data available.</p>
          ) : (
            <Chart type="pie" data={pieData} />
          )}
        </div>
        <div className="chart-card">
          <h2 className="chart-card-title">Expense Trend</h2>
          {barData.length === 0 ? (
            <p className="chart-empty">No data available.</p>
          ) : (
            <Chart type="bar" data={barData} series={[{ key: "Expense", color: "#EF4444" }]} />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="page-actions" style={{ marginTop: '8px' }}>
        <button
          id="expense-add-btn"
          className="btn btn-expense"
          onClick={openAddModal}
        >
          <Plus size={16} /> Add Expense
        </button>
        <button
          id="expense-download-btn"
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
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-icon"><BadgeIndianRupee /></p>
          <p className="empty-state-text">No expense records yet — add your first one!</p>
          <button className="btn btn-expense" onClick={openAddModal}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      ) : (
        <motion.div
          className="record-list"
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onEdit={openEditModal}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </motion.div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editRecord ? "Edit Expense" : "Add Expense"}
      >
        {formError && (
          <div className="auth-error" role="alert">{formError}</div>
        )}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Description / Title */}
          <div className="form-group">
            <label htmlFor="expense-description" className="form-label">Title / Description</label>
            <input
              id="expense-description"
              name="description"
              type="text"
              className="form-input"
              placeholder="e.g. Grocery shopping"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category — disabled when editing */}
          <div className="form-group">
            <label htmlFor="expense-category" className="form-label">
              Category {editRecord && <span className="form-hint">(cannot be changed)</span>}
            </label>
            <select
              id="expense-category"
              name="category"
              className="form-input"
              value={form.category}
              onChange={handleChange}
              disabled={!!editRecord}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="expense-amount" className="form-label">Amount (₹)</label>
            <input
              id="expense-amount"
              name="amount"
              type="number"
              min="1"
              className="form-input"
              placeholder="e.g. 2000"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date — disabled when editing */}
          <div className="form-group">
            <label htmlFor="expense-date" className="form-label">
              Date {editRecord && <span className="form-hint">(cannot be changed)</span>}
            </label>
            <input
              id="expense-date"
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
            <button type="button" className="btn btn-outline" onClick={closeModal}>
              Cancel
            </button>
            <button
              id="expense-form-submit"
              type="submit"
              className="btn btn-expense"
              disabled={formLoading}
            >
              {formLoading
                ? "Saving…"
                : editRecord
                  ? "Save Changes"
                  : "Add Expense"}
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
          Are you sure you want to delete this expense record? This action cannot be undone.
        </p>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => setDeleteId(null)}>
            Cancel
          </button>
          <button
            id="expense-confirm-delete"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}

export default Expense;
