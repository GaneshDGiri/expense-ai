import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTransaction = ({ user }) => {
  const navigate = useNavigate();
  
  // Get current date/time strings for default values
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0]; // "2024-01-08"
  const defaultTime = now.toTimeString().slice(0, 5);  // "14:30"

  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    date: defaultDate,
    time: defaultTime,
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Create a Valid Date Object
    const dateTimeString = `${formData.date}T${formData.time}`;
    const finalDate = new Date(dateTimeString);

    try {
      await axios.post('http://localhost:5000/api/transactions', {
        userId: user._id,
        type: formData.type,
        category: formData.type === 'income' ? 'Salary' : formData.category,
        amount: Number(formData.amount),
        date: finalDate, // Send valid date
        description: formData.description || "No description"
      });
      
      alert("Transaction Added! ✅");
      navigate('/'); // Go back to Dashboard
      window.location.reload(); // Reload to see new data
    } catch (err) {
      console.error(err);
      alert("Error: Could not save transaction. Check console.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Entry</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Type */}
        <div style={{display:'flex', gap:'10px'}}>
            <label style={{flex:1}}>Type:
                <select name="type" value={formData.type} onChange={handleChange} style={{padding:'8px'}}>
                    <option value="expense">Expense 💸</option>
                    <option value="income">Income 💰</option>
                </select>
            </label>
        </div>

        {/* Category */}
        {formData.type === 'expense' && (
          <label>Category:
            <select name="category" value={formData.category} onChange={handleChange} style={{padding:'8px'}}>
              <option value="Food">Food & Dining</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Medical">Medical</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills & Rent</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </label>
        )}

        {/* Amount */}
        <label>Amount (₹):
            <input name="amount" type="number" placeholder="e.g. 150" value={formData.amount} onChange={handleChange} required style={{padding:'8px'}} />
        </label>

        {/* Date & Time */}
        <div style={{display:'flex', gap:'10px'}}>
            <label style={{flex:1}}>Date:
                <input name="date" type="date" value={formData.date} onChange={handleChange} required style={{padding:'8px'}} />
            </label>
            <label style={{flex:1}}>Time:
                <input name="time" type="time" value={formData.time} onChange={handleChange} required style={{padding:'8px'}} />
            </label>
        </div>

        {/* Description */}
        <label>Note:
            <input name="description" type="text" placeholder="e.g. Pizza" value={formData.description} onChange={handleChange} style={{padding:'8px'}} />
        </label>

        <button type="submit" style={{marginTop:'20px'}}>Save Transaction</button>
      </form>
    </div>
  );
};

export default AddTransaction;