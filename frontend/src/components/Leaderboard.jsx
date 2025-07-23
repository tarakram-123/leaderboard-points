import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/points/leaderboard");
      setUsers(res.data);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      alert("Failed to load leaderboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-card">
        <h3 className="leaderboard-title">Leaderboard</h3>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-card">
      <h3 className="leaderboard-title">Leaderboard</h3>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, idx) => (
                <tr key={user._id || user.id || idx}>
                  <td>
                    <span className="fw-bold">
                      {getRankBadge(idx + 1)}
                    </span>
                  </td>
                  <td>{user.name}</td>
                  <td>
                    <span className="badge bg-success">
                      {user.totalPoints}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No users found. Add some users to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-end">
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={loadLeaderboard}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;