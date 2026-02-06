const router = require('express').Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// FIXED MODEL STRING: No "models/" prefix
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/analyze', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const monthlyTransactions = await Transaction.find({
      userId,
      date: { $gte: startOfMonth }
    }).sort({ date: 1 });

    const recentHistory = await Transaction.find({ userId }).sort({ date: -1 }).limit(10);

    const expenses = monthlyTransactions.filter(t => t.type === 'expense');
    const income = monthlyTransactions.filter(t => t.type === 'income');
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalIncomeAdded = income.reduce((acc, curr) => acc + curr.amount, 0); 
    const totalAvailableBudget = (user.monthlyBudget || 0) + totalIncomeAdded;
    const remainingBudget = totalAvailableBudget - totalSpent;

    // --- Graphs Data ---
    const graphMap = {};
    monthlyTransactions.forEach(t => {
      const day = new Date(t.date).getDate();
      if (!graphMap[day]) graphMap[day] = { day: `${day}`, income: 0, expense: 0 };
      if (t.type === 'income') graphMap[day].income += t.amount;
      else graphMap[day].expense += t.amount;
    });

    const catMap = {};
    expenses.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });

    const aiWagonData = [
      { subject: 'Budget Sync', A: Math.min(100, Math.max(0, (remainingBudget / (totalAvailableBudget || 1)) * 100)) },
      { subject: 'Saving Goal', A: user.savingsGoal > 0 ? Math.min(100, (totalIncomeAdded / user.savingsGoal) * 100) : 50 },
      { subject: 'Risk Control', A: remainingBudget < 0 ? 20 : 90 },
      { subject: 'Discipline', A: totalSpent > totalAvailableBudget ? 30 : 85 },
      { subject: 'Cash Flow', A: totalIncomeAdded > totalSpent ? 95 : 40 }
    ];

    // --- SMART LOCAL LOGIC (No more empty boxes) ---
    let aiResponse = { 
        analysis: remainingBudget < 0 ? "Warning: Overspent" : "Good spent history!", 
        dont_spend: "Excessive non-essential items", 
        saving_tip: "Automate 10% of today's limit." 
    };

    // Attempt Gemini call
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `JSON ONLY: {"analysis": "comment", "dont_spend": "item", "saving_tip": "tip"}. Data: Budget ₹${totalAvailableBudget}, Spent ₹${totalSpent}.`;
        const result = await model.generateContent(prompt);
        aiResponse = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());
      } catch (e) { /* Silent fail to local logic */ }
    }

    res.json({
      totalSpent, remainingBudget, dailyLimit: (remainingBudget / 15).toFixed(0),
      ai: aiResponse,
      graphData: Object.values(graphMap),
      categoryPieData: Object.entries(catMap).map(([name, value]) => ({ name, value })),
      aiWagonData,
      recentHistory
    });
  } catch (err) { res.status(500).json({ error: "Server Error" }); }
});

module.exports = router;