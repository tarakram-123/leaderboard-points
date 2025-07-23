import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserSelector = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!selected) {
      alert("Please select a user first.");
      return;
    }
    
    setClaiming(true);
    try {
      const res = await axios.post("http://localhost:5000/api/points", { 
        userId: selected 
      });
      
      const points = res.data.points || res.data.pointsAwarded || 0;
      alert(`🎉 +${points} points awarded successfully!`);
      
      // Refresh users list and reset selection
      await fetchUsers();
      setSelected('');
    } catch (error) {
      console.error("Error claiming points:", error);
      if (error.response?.status === 404) {
        alert("User not found. Please refresh and try again.");
      } else {
        alert("Error claiming points. Please try again.");
      }
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Select User to Claim Points</h3>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Select User to Claim Points</h3>
        <div className="mb-3">
          <select 
            className="form-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={claiming}
          >
            <option value="">-- Select User --</option>
            {users.map(user => (
              <option key={user._id || user.id} value={user._id || user.id}>
                {user.name} ({user.totalPoints || 0} points)
              </option>
            ))}
          </select>
        </div>
        
        {users.length === 0 && (
          <div className="alert alert-warning" role="alert">
            No users available. Please add some users first.
          </div>
        )}
        
        <button 
          className="btn btn-success w-100 mb-2"
          onClick={handleClaim}
          disabled={!selected || claiming || users.length === 0}
        >
          {claiming ? 'Claiming...' : '🎯 Claim Points'}
        </button>
        
        <button 
          className="btn btn-outline-secondary btn-sm w-100"
          onClick={fetchUsers}
          disabled={loading || claiming}
        >
          🔄 Refresh Users
        </button>
      </div>
    </div>
  );
};

export default UserSelector;