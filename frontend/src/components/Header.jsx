import React from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectIsAuthenticated, logout } from '../store/authSlice.js';
import routes from '../routes/routes.js';

const Header = () => {
  const { t } = useTranslation('chat');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar expand="lg" className="navbar-custom shadow-sm">
      <div className="container">
        {isAuthenticated ? (
          <span className="navbar-brand-span"><strong>{t('header.title')}</strong></span>
        ) : (
          <Navbar.Brand as={Link} to={routes.main} className="navbar-brand-custom">
            <strong>{t('header.title')}</strong>
          </Navbar.Brand>
        )}
        {isAuthenticated && (
          <Button onClick={handleLogout} className="btn-custom-logout">
            {t('header.logout')}
          </Button>
        )}
      </div>
    </Navbar>
  );
};

export default Header;
