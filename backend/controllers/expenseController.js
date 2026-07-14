import expenseModel from "../models/expenseModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dataFilter.js";

// ADD EXPENSE
export async function addExpense(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });

        await newExpense.save();

        res.status(200).json({
            success: true,
            message: "Expense added successfully",
            expense: newExpense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding expense",
            error: error.message
        });
    }
}

// GET ALL EXPENSES
export async function getAllExpense(req, res) {
    const userId = req.user._id;

    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            message: "All expenses fetched successfully",
            expenses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching expenses",
            error: error.message
        });
    }
}

// UPDATE EXPENSE
export async function updateExpense(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount } = req.body;

    try {
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense: updatedExpense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating expense",
            error: error.message
        });
    }
}

// DELETE EXPENSE
export async function deleteExpense(req, res) {
    try {
        const expense = await expenseModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting expense",
            error: error.message
        });
    }
}

// DOWNLOAD EXPENSE EXCEL
export async function downloadExpenseExcel(req, res) {
    const userId = req.user._id;

    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });

        const plainData = expenses.map((expense) => ({
            Description: expense.description,
            Amount: expense.amount,
            Category: expense.category,
            Date: new Date(expense.date).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", "attachment; filename=expense_details.xlsx");
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.send(buffer);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error generating Excel file",
            error: error.message
        });
    }
}

// EXPENSE OVERVIEW
export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;

        const { start, end } = getDateRange(range);

        const expenses = await expenseModel.find({
            userId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense = expense.length > 0 ? totalExpense / expense.length : 0;
        const numberOfTransactions = expense.length;
        const recentTransactions = expense.slice(0, 5);

        res.json({
            success: true,
            message: "Expense overview retrieved successfully",
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving expense overview",
            error: error.message
        });
    }
}