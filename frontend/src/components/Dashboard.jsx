import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

// Professional Palette
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Dashboard = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for Editing Information
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    monthlyBudget: user?.monthlyBudget || 0,
    savingsGoal: user?.savingsGoal || 0,
    avatar: user?.avatar || ''
  });

  const fetchData = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/ai/analyze', { userId: user._id });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // Handle Profile Picture Upload (Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/update/${user._id}`, editForm);
      localStorage.setItem('user', JSON.stringify(res.data));
      setIsEditing(false);
      window.location.reload(); 
    } catch (err) {
      alert("Update failed. Try again.");
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'100px', fontSize:'1.2rem'}}>🔄 Loading Financial Intelligence...</div>;
  if (!data) return <div style={{textAlign:'center', marginTop:'50px'}}>No data received. Add some expenses first!</div>;

  return (
    <div className="dashboard" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* =======================
          SECTION 1: PROFILE HEADER & EDITING
         ======================= */}
      <div className="card profile-header" style={{ marginBottom: '25px', padding: '25px', borderRadius: '15px', background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Avatar Section */}
          <div style={{ textAlign: 'center' }}>
            <img 
              src={editForm.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #6366f1' }} 
              alt="Profile" 
            />
            {isEditing && (
              <label style={{ display: 'block', marginTop: '10px', fontSize: '0.75rem', background: '#eef2ff', padding: '5px', borderRadius: '5px', cursor: 'pointer', color: '#6366f1', fontWeight: 'bold' }}>
                📷 Change Photo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* Details Section */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} placeholder="Name" style={{ padding: '6px' }} />
                    <input value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} placeholder="Gmail" style={{ padding: '6px' }} />
                  </div>
                ) : (
                  <>
                    <h2 style={{ margin: 0, color: '#1e293b' }}>Name: {user.name}</h2>
                    <p style={{ margin: '5px 0', color: '#64748b' }}>Gmail: {user.email}</p>
                  </>
                )}
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Mobile: {user.mobile}</p>
              </div>

              <div style={{ textAlign: 'right', minWidth: '220px' }}>
                {!isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(true)} style={{ padding: '8px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Edit Information</button>
                    <p style={{ marginTop: '15px', fontSize: '1rem' }}>Budget: <b>₹{user.monthlyBudget}</b></p>
                    <p style={{ margin: 0, color: '#10b981', fontWeight: 'bold' }}>Goal Save: ₹{user.savingsGoal || 0}</p>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="number" placeholder="Budget" value={editForm.monthlyBudget} onChange={(e) => setEditForm({...editForm, monthlyBudget: e.target.value})} style={{ padding: '6px' }} />
                    <input type="number" placeholder="Goal Save" value={editForm.savingsGoal} onChange={(e) => setEditForm({...editForm, savingsGoal: e.target.value})} style={{ padding: '6px' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={handleSaveProfile} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', padding: '8px', borderRadius: '5px' }}>Save</button>
                      <button onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#64748b', color: '#fff', border: 'none', padding: '8px', borderRadius: '5px' }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          SECTION 2: AI INSIGHTS BOXES
         ======================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ borderLeft: '6px solid #6366f1', padding: '20px', background: '#fff', borderRadius: '12px' }}>
          <h4 style={{ marginTop: 0, color: '#6366f1' }}>🧐 AI Analysis</h4>
          <p style={{ fontSize: '0.95rem', color: '#334155' }}>{data.ai?.analysis || "Analyzing spent habits..."}</p>
        </div>
        <div className="card" style={{ borderLeft: '6px solid #ef4444', padding: '20px', background: '#fff5f5', borderRadius: '12px' }}>
          <h4 style={{ marginTop: 0, color: '#ef4444' }}>🚫 Avoid Today</h4>
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#b91c1c' }}>{data.ai?.dont_spend || "Extra expenditure on non-essentials"}</p>
        </div>
        <div className="card" style={{ borderLeft: '6px solid #10b981', padding: '20px', background: '#f0fdf4', borderRadius: '12px' }}>
          <h4 style={{ marginTop: 0, color: '#10b981' }}>💡 Saving Tip</h4>
          <p style={{ fontSize: '0.95rem', color: '#166534' }}>{data.ai?.saving_tip || "Save 10% more today."}</p>
        </div>
      </div>

      {/* =======================
          SECTION 3: THE 4 GRAPHS
         ======================= */}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '25px', marginBottom: '30px' }}>
        
        {/* Graph 1: Income vs Expense Bar */}
        <div className="card" style={{ padding: '20px', background: '#fff', borderRadius: '15px', height: '400px' }}>
          <h4 style={{ marginBottom: '15px' }}>1. Income vs Expense</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data.graphData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 2: Spent History Bar */}
        <div className="card" style={{ padding: '20px', background: '#fff', borderRadius: '15px', height: '400px' }}>
          <h4 style={{ marginBottom: '15px' }}>2. Daily Spent History</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data.graphData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expense" name="Spent" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 3: Category Pie Chart */}
        <div className="card" style={{ padding: '20px', background: '#fff', borderRadius: '15px', height: '400px' }}>
          <h4 style={{ marginBottom: '15px' }}>3. Spending Categories</h4>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={data.categoryPieData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                {data.categoryPieData?.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 4: AI Wagon Wheel Radar */}
        <div className="card" style={{ padding: '20px', background: '#fff', borderRadius: '15px', height: '400px' }}>
          <h4 style={{ marginBottom: '15px' }}>4. AI Details Chart (Wagon Wheel)</h4>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.aiWagonData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Health Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* =======================
          SECTION 4: TRANSACTION HISTORY
         ======================= */}
      <div className="card" style={{ padding: '0', background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>📜 Detailed Transaction History</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: '#f1f5f9', fontSize: '0.85rem', color: '#64748b' }}>
                <th style={{ padding: '15px 20px' }}>Date</th>
                <th style={{ padding: '15px 20px' }}>Type</th>
                <th style={{ padding: '15px 20px' }}>Category</th>
                <th style={{ padding: '15px 20px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.recentHistory?.map((txn, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>{new Date(txn.date).toLocaleDateString()}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold',
                      background: txn.type === 'income' ? '#dcfce7' : '#fee2e2',
                      color: txn.type === 'income' ? '#166534' : '#991b1b'
                    }}>
                      {txn.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>{txn.category}</td>
                  <td style={{ padding: '15px 20px', textAlign: 'right', fontWeight: 'bold', color: txn.type === 'income' ? '#10b981' : '#ef4444' }}>
                    {txn.type === 'income' ? '+' : '-'} ₹{txn.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;