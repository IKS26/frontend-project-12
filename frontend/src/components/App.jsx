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

const App = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column h-100">
        <Header />
        <div className="flex-grow-1 d-flex flex-column">
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
        hideProgressBar={true}
        closeOnClick={true}  
		  closeButton={true}
        limit={3}
		  theme="dark"
		  transition={Slide}
		  />
      </div>
    </BrowserRouter>
  );
};

export default App;
