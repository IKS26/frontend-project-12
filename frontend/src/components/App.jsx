/* eslint-disable object-curly-newline */
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import Header from './Header.jsx';
import GlobalSpinner from './spinners/GlobalSpinner.jsx';
import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import routes from '../routes/routes.js';
import LoginPage from '../pages/LoginPage.jsx';
import SignUpPage from '../pages/SignUpPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import PageNotFound from '../pages/PageNotFound.jsx';

const App = () => {
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('appLoaded')) {
      setTimeout(() => {
        setAppLoaded(true);
        sessionStorage.setItem('appLoaded', 'true');
      }, 2000);
    } else {
      setAppLoaded(true);
    }
  }, []);

  if (!appLoaded) return <GlobalSpinner />;

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <div className="chat-container">
          <Routes>
            <Route path={routes.login} element={<LoginPage />} />
            <Route path={routes.signUp} element={<SignUpPage />} />
            <Route path={routes.main} element={<ProtectedRoute />}>
              <Route index element={<HomePage />} />
            </Route>
            <Route path={routes.notFound} element={<PageNotFound />} />
          </Routes>
        </div>
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
      </div>
    </BrowserRouter>
  );
};

export default App;
