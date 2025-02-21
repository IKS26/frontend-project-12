import React, { Suspense, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App.jsx';
import store from './store/store.js';
import {
  connectSocket,
  disconnectSocket,
  subscribeToEvents,
} from './services/socket.js';
import { dataApi } from './services/dataApi.js';
import { setCurrentChannelId, selectChannels, selectCurrentChannelId, DEFAULT_CHANNEL_ID } from './store/channelsSlice.js';

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: 'production',
};

const SocketHandler = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectChannels);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const isLoading = useSelector((state) => state.channels.isLoading);

  useEffect(() => {
    if (!channels || isLoading) return;

    const token = localStorage.getItem('token');
    connectSocket(token);

    const handleNewMessage = (message) => {
      dispatch(
        dataApi.util.updateQueryData('fetchMessages', message.channelId, (draft) => {
          draft.push(message);
        })
      );
    };

    const handleNewChannel = (newChannel) => {
      dispatch(
        dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
          draft.push(newChannel);
        })
      );
    };

    const handleRemoveChannel = (channelId) => {
      dispatch(
        dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
          return draft.filter((channel) => channel.id !== channelId);
        })
      );
      dispatch(
        dataApi.util.updateQueryData('fetchMessages', channelId, () => {
          return [];
        })
      );
      if (currentChannelId === channelId) {
        dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
      };
		dispatch(dataApi.util.invalidateTags(['Channels']));
    };

    const handleRenameChannel = ({ id, name }) => {
      dispatch(
        dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
          const channel = draft.find((channel) => channel.id === id);
          if (channel) {
            channel.name = name;
          }
        })
      );
    };

    subscribeToEvents(handleNewMessage, handleNewChannel, handleRemoveChannel, handleRenameChannel);

    return () => {
      disconnectSocket();
    };
  }, [dispatch, isLoading, channels, currentChannelId]);

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
