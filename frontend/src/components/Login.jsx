import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data)); // Persist login
      navigate('/');
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="auth-form">
      <h2>Welcome Back</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} required/>
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} required/>
        <button type="submit">Login</button>
      </form>
      <p style={{marginTop:'10px'}}>New here? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;