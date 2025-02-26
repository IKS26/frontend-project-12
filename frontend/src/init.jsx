import React, { Suspense, useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App.jsx';
import store from './store/store.js';
import { connectSocket, subscribeToEvents } from './services/socket.js';
import { dataApi } from './services/dataApi.js';
import { selectCurrentChannelId } from './store/channelsSlice.js';

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: 'production',
};

const SocketHandler = () => {
  const dispatch = useDispatch();
  const currentChannelId = useSelector(selectCurrentChannelId);
  const isLoading = useSelector((state) => state.channels.isLoading);

  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    if (isLoading || isSocketConnected) return;

    connectSocket();
    setIsSocketConnected(true);

    const handleNewMessage = (message) => {
      console.log('Новое сообщение из WebSocket:', message);
      dispatch(
        dataApi.util.updateQueryData('fetchMessages', message.channelId, (draft) => {
          draft.push(message);
        }),
      );
    };

    const handleNewChannel = (channel) => {
      console.log('Новый канал из WebSocket:', channel);
      dispatch(
        dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
          draft.push(channel);
        }),
      );
    };

    const handleRemoveChannel = (channelId) => {
      console.log('Удаление канала из WebSocket:', channelId);
      dispatch(dataApi.util.invalidateTags(['Channels', 'Messages']));
    };

    const handleRenameChannel = (channel) => {
      console.log('Переименование канала из WebSocket:', channel);
      dispatch(dataApi.util.invalidateTags(['Channels']));
    };

    subscribeToEvents(handleNewMessage, handleNewChannel, handleRemoveChannel, handleRenameChannel);
  }, [dispatch, isLoading, currentChannelId, isSocketConnected]);

  return null;
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
              <SocketHandler />
              <App />
            </Suspense>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
