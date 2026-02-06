const router = require('express').Router();
const User = require('../models/User');

// --- REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile, monthlyIncome, monthlyBudget } = req.body;
    const newUser = new User({
      name, email, password, mobile,
      monthlyIncome: Number(monthlyIncome) || 0,
      monthlyBudget: Number(monthlyBudget) || 0,
      avatar: "" // Default empty
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) { res.status(500).json(err); }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");
    if (user.password !== req.body.password) return res.status(400).json("Wrong password");
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) { res.status(500).json(err); }
});

// --- UPDATE PROFILE (Handles Avatar, Gmail, Budget, Goal) ---
router.put('/update/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          monthlyBudget: Number(req.body.monthlyBudget),
          savingsGoal: Number(req.body.savingsGoal),
          avatar: req.body.avatar // Storing Base64 Image String
        },
      },
      { new: true }
    );
    const { password, ...others } = updatedUser._doc;
    res.status(200).json(others);
  } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

module.exports = router;