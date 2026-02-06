const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String },
    monthlyBudget: { type: Number, default: 0 },
    savingsGoal: { type: Number, default: 0 },
    avatar: { type: String, default: "" } // <--- Ensure this is here
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);