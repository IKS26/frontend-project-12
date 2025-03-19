/* eslint-disable object-curly-newline */
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import Header from './Header.jsx';
import WelcomeSpinner from './spinners/WelcomeSpinner.jsx';
import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import routes from '../routes/routes.js';
import LoginPage from '../pages/LoginPage.jsx';
import SignUpPage from '../pages/SignUpPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import PageNotFound from '../pages/PageNotFound.jsx';

const APP_LOAD_DELAY_MS = 2300;

const App = () => {
  const [shouldShowWelcome, setShouldShowWelcome] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('shouldShowWelcome')) {
      setTimeout(() => {
        setShouldShowWelcome(true);
        localStorage.setItem('shouldShowWelcome', 'true');
      }, APP_LOAD_DELAY_MS);
    } else {
      setShouldShowWelcome(true);
    }
  }, []);

  return (
    !shouldShowWelcome
      ? (<WelcomeSpinner />)
      : (
        <>
          <BrowserRouter>
            <div className="d-flex flex-column vh-100">
              <Header />
              <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                <Routes>
                  <Route path={routes.login} element={<LoginPage />} />
                  <Route path={routes.signUp} element={<SignUpPage />} />
                  <Route path={routes.home} element={<ProtectedRoute />}>
                    <Route index element={<HomePage />} />
                  </Route>
                  <Route path={routes.notFound} element={<PageNotFound />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
            closeOnClick
            closeButton
            limit={3}
            theme="dark"
            transition={Slide}
          />
        </>
      )
  );
};

export default App;
