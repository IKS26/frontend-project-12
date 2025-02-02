import React from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../store/authSlice.js';
import rollbar from '../../rollbar.js';

const Header = () => {
  const { t } = useTranslation('chat');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleTestError = () => {
	try {
	  throw new Error('Это тестовая ошибка для Rollbar');
	} catch (error) {
	  rollbar.error(error);
	}
 };

  return (
    <Navbar expand="lg" className="navbar-custom shadow-sm">
      <div className="container">
        <Navbar.Brand as={Link} to="/" className="text-light">
          <strong>{t('header.title')}</strong>
        </Navbar.Brand>
		  <h1 className="text-light">Rollbar тест</h1>
        <Button onClick={handleTestError}>Вызвать ошибку</Button>
        {isAuthenticated && <Button onClick={handleLogout} variant="outline-light">{t('header.logout')}</Button>}
      </div>
    </Navbar>
  );
};

export default Header;
