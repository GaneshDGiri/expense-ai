import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import Landing from './components/Landing'; // Import the new component

// Helper component to hide Navbar on Landing/Login pages if desired
const Layout = ({ children, user, handleLogout }) => {
  const location = useLocation();
  // Hide Navbar only on Landing Page ('/') if user is NOT logged in
  const showNavbar = user || location.pathname !== '/';

  return (
    <div className="app-container">
      {showNavbar && (
        <nav className="navbar">
          <div className="logo">💰 SmartSpend AI</div>
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/add">Add Expense</Link>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>
      )}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Layout user={user} handleLogout={handleLogout}>
        <Routes>
          {/* Route Logic:
             1. Home (/) -> Shows Landing Page (if not logged in) OR Dashboard (if logged in)
             2. Dashboard -> Protected Route
          */}
          
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Landing />} 
          />
          
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/add" 
            element={user ? <AddTransaction user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/login" 
            element={<Login setUser={setUser} />} 
          />
          
          <Route 
            path="/register" 
            element={<Register />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;