const router = require('express').Router();
const Transaction = require('../models/Transaction');

// ADD TRANSACTION
router.post('/', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();
    res.status(200).json(savedTransaction);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER TRANSACTIONS
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;