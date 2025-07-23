import React from 'react';
import AddUserForm from './components/AddUserForm';
import UserSelector from './components/UserSelector';
import Leaderboard from './components/Leaderboard';

const App = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 text-center mb-4">
          <h1 className="display-4">🏆 Claim Points System</h1>
          <p className="lead">Earn points and climb the leaderboard!</p>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-lg-4 col-md-6">
          <AddUserForm />
        </div>
        
        <div className="col-lg-4 col-md-6">
          <UserSelector />
        </div>
        
        <div className="col-lg-4 col-md-12">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default App;