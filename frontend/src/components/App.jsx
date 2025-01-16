import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import HomePage from './HomePage.jsx';
import PageNotFound from './PageNotFound.jsx';

const App = () => {
	return (
	 <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
	);
};

export default App;