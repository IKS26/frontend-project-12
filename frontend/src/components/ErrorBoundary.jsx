import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ErrorBoundary = ({ children }) => {
  const { t } = useTranslation('errors');
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
    return <h1>{t('errorBoundary.title')}</h1>;
  }

  return children;
};

export default ErrorBoundary;
