import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', password: '', monthlyBudget: '', monthlyIncome: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration Successful!");
      navigate('/login');
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required/>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required/>
        <input name="mobile" type="text" placeholder="Mobile Number (e.g., 9876543210)" onChange={handleChange} required/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required/>
        <input name="monthlyIncome" type="number" placeholder="Monthly Income (₹)" onChange={handleChange} required/>
        <input name="monthlyBudget" type="number" placeholder="Monthly Budget Limit (₹)" onChange={handleChange} required/>
        <button type="submit">Register</button>
      </form>
      <p style={{marginTop:'10px'}}>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;