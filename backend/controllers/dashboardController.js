import incomeModel from "../models/incomeModel.js"
import expenseModel from "../models/expenseModel.js"

function buildMonthlyTrend(incomes, expenses, now) {
    return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
        const sameMonth = (record) => {
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === date.getFullYear() && recordDate.getMonth() === date.getMonth();
        };

        return {
            name: date.toLocaleString("en-IN", { month: "short" }),
            Income: incomes.filter(sameMonth).reduce((sum, record) => sum + Number(record.amount || 0), 0),
            Expense: expenses.filter(sameMonth).reduce((sum, record) => sum + Number(record.amount || 0), 0),
        };
    });
}

export async function getDashboardOverview(req,res) {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(),1);
    const trendStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
     try { 
        const incomes = await incomeModel.find({
            userId,
            date: {$gte: startOfMonth, $lte: now}
        }).lean();

        const expenses = await expenseModel.find({
            userId,
            date: {$gte: startOfMonth, $lte: now}
        }).lean();

        const [trendIncomes, trendExpenses] = await Promise.all([
          incomeModel.find({ userId, date: { $gte: trendStart, $lte: now } }).lean(),
          expenseModel.find({ userId, date: { $gte: trendStart, $lte: now } }).lean(),
        ]);
        
        const monthlyIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const monthlyExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const savings = monthlyIncome - monthlyExpense;
        const savingsRate = monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

        const recentTransactions = [
          ...incomes.map((i) => ({ ...i, type: "income" })),
          ...expenses.map((e) => ({ ...e, type: "expense" })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const spendByCategory = {};
        for (const exp of expenses) {
          const cat = exp.category || "Other";
          spendByCategory[cat] = (spendByCategory[cat] || 0) + Number(exp.amount || 0);
        }
        // FOR CHART
        const expenseDistribution = Object.entries(spendByCategory).map(([category, amount]) => ({
          category,
          amount,
          percent: monthlyExpense === 0 ? 0 : Math.round((amount / monthlyExpense) * 100),
        }));
        const trend = buildMonthlyTrend(trendIncomes, trendExpenses, now);

        return res.status(200).json({
            success: true,
            data: {
                monthlyIncome,
                monthlyExpense,
                savings,
                savingsRate,
                recentTransactions,
                spendByCategory,
                expenseDistribution,
                trend,
            }
        })
     }
    catch (error) {
    console.error("Dashboard Overview Error:", error);

    return res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard overview",
        error: error.message
        });
    }    
}
