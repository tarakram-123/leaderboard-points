import React, { useState } from 'react';
import axios from 'axios';

const AddUserForm = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    if (!name.trim()) {
      alert("Please enter a valid name.");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users", { name: name.trim() });
      alert("User added successfully!");
      setName('');
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.response?.status === 409) {
        alert("User already exists!");
      } else {
        alert("Error occurred while adding user.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddUser();
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Add New User</h3>
        <div className="mb-3">
          <input 
            type="text"
            className="form-control"
            placeholder="Enter user name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>
        <button 
          className="btn btn-primary w-100"
          onClick={handleAddUser}
          disabled={loading || !name.trim()}
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </div>
    </div>
  );
};

export default AddUserForm;