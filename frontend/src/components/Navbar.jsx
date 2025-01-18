import React from 'react';
import { Button, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <BootstrapNavbar expand="lg" className="navbar-custom shadow-sm">
      <div className="container">
        <BootstrapNavbar.Brand as={Link} to="/" className="text-light">
		  <strong>Slack-Chat</strong>
        </BootstrapNavbar.Brand>
        {isAuthenticated && <Button onClick={handleLogout} variant="outline-light">Выйти</Button>}
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;