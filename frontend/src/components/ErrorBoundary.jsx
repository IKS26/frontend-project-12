import React, { useState, useEffect } from 'react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error('ErrorBoundary caught an error', error, errorInfo);
      setHasError(true);
    };

    const errorHandler = (event) => handleError(event.error, event.errorInfo);
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);

  if (hasError) {
    return <h1>Что-то пошло не так.</h1>;
  }

  return children;
};

export default ErrorBoundary;
