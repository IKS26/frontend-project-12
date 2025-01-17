import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="text-center">
      <h1>Welcome to the Slack-Chat</h1>
      <p>This is the home page.</p>
		<button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;
