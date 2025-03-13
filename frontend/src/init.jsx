import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App.jsx';
import store from './store/store.js';
import initI18n from './utils/initI18n.js';
import initWebSocketListeners from './utils/webSocketListeners.js';
import SimpleSpinner from './components/spinners/SimpleSpinner.jsx';

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: 'production',
};

const init = async (socket) => {
  const i18n = await initI18n();
  initWebSocketListeners(socket, store.dispatch);

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Suspense fallback={<SimpleSpinner />}>
              <App />
            </Suspense>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
