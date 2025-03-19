import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App.jsx';
import store from './store/store.js';
import { dataApi } from './api/dataApi';
import SimpleSpinner from './components/spinners/SimpleSpinner.jsx';

const ROLLBAR_CONFIG = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: 'production',
};

const initI18n = async () => {
  const i18n = i18next.createInstance();

  try {
    await i18n
      .use(HttpApi)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        supportedLngs: ['en', 'ru'],
        fallbackLng: 'en',
        debug: false,
        detection: {
          order: ['localStorage', 'cookie', 'navigator'],
          caches: ['localStorage', 'cookie'],
        },
        ns: ['auth', 'chat'],
        defaultNS: ['auth', 'chat'],
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        interpolation: {
          escapeValue: false,
        },
      });
  } catch (error) {
    throw new Error('Не удалось инициализировать i18n');
  }

  return i18n;
};

leoProfanity.loadDictionary();
leoProfanity.add(leoProfanity.getDictionary('ru'));
leoProfanity.add(leoProfanity.getDictionary('en'));

const initWebSocketListeners = (socket, dispatch) => {
  socket.on('newMessage', (message) => {
    dispatch(
      dataApi.util.updateQueryData('fetchMessages', message.channelId, (draft) => {
        draft.push(message);
      }),
    );
  });

  socket.on('newChannel', (channel) => {
    dispatch(
      dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
        draft.push(channel);
      }),
    );
  });

  socket.on('removeChannel', () => {
    dispatch(dataApi.util.invalidateTags(['Channels', 'Messages']));
  });

  socket.on('renameChannel', () => {
    dispatch(dataApi.util.invalidateTags(['Channels']));
  });
};

const init = async (socket) => {
  const i18n = await initI18n();
  initWebSocketListeners(socket, store.dispatch);

  return (
    <RollbarProvider config={ROLLBAR_CONFIG}>
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
