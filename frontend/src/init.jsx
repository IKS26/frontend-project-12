import React, { Suspense } from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App.jsx';
import store from './store/store.js';
import { Provider } from 'react-redux';

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: 'production',
};

const init = async () => {
  const i18n = i18next.createInstance();

  await i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      supportedLngs: ['en', 'ru'],
      fallbackLng: 'en',
      debug: true,
      detection: {
        order: ['localStorage', 'cookie', 'navigator'],
        caches: ['localStorage', 'cookie'],
      },
      ns: ['auth', 'chat', 'errors', 'modals'],
      defaultNS: ['auth', 'chat', 'errors', 'modals'],
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
    });

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Suspense fallback={<div>Loading translations...</div>}>
              <App />
            </Suspense>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
