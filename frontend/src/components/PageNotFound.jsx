import React from 'react';
import { useTranslation } from 'react-i18next';

const PageNotFound = () => {
  const { t } = useTranslation('errors');

  return (
    <div className="text-center">
      <h1>{t('pageNotFound.title')}</h1>
      <p>{t('pageNotFound.description')}</p>
    </div>
  );
};

export default PageNotFound;
