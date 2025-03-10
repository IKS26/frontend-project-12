/* eslint-disable object-curly-newline */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import LoginPage from './LoginPage.jsx';
import Header from './Header.jsx';
import HomePage from './HomePage.jsx';
import SignUpPage from './SignUpPage.jsx';
import PageNotFound from './PageNotFound.jsx';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
const App = () => (
  <BrowserRouter>
    <div className="app-container">
      <Header />
      <div className="chat-container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
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

export default App;
