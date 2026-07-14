import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dataFilter.js";


// ADD INCOME
export async function addIncome(req, res) {
    const userId = req.user._id
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });
        await newIncome.save();
        res.status(200).json({
            success: true,
            message: "Income added successfully",
            income: newIncome
        })
    }

    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding income",
            error: error.message
        })
    }
}

// GET ALL INCOME

export async function getAllIncome(req, res) {
    const userId = req.user._id;
    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            message: "All incomes fetched successfully",
            incomes
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching incomes",
            error: error.message
        })
    }
}

//UPDATE INCOME

export async function updateIncome(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount } = req.body;
    try {
        const updatedIncome = await incomeModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount },
            { new: true })
        if (!updatedIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Income updated successfully",
            income: updatedIncome
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating income",
            error: error.message
        })
    }
}

// DELETE INCOME

export async function deleteIncome(req, res) {
    try {
        const income = await incomeModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Income deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting income",
            error: error.message
        });
    }
}

// TO DOWNLOAD THE INCOME/DATA IN EXCEL FORMAT
export async function downloadIncomeExcel(req, res) {
    const userId = req.user._id;
    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
        const plainData = incomes.map((income) => ({
            Description: income.description,
            Amount: income.amount,
            Category: income.category,
            Date: new Date(income.date).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Income");

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", "attachment; filename=income_details.xlsx");
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.send(buffer);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error generating Excel file",
            error: error.message
        });
    }
}

// INCOME OVERVIEW

export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const { start, end } = getDateRange(range);

        const incomes = await incomeModel.find({
            userId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });
        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;
        const recentTransactions = incomes.slice(0, 9);
        res.json({
            success: true,
            message: "Income overview retrieved successfully",
            data: {
                totalIncome,
                averageIncome,
                numberOfTransactions,
                recentTransactions,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving income overview",
            error: error.message
        });
    }
}