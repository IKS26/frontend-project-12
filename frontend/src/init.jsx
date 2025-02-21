import React, { Suspense, useEffect, useRef } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App.jsx';
import store from './store/store.js';
import socket, {
  connectSocket,
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
  const token = localStorage.getItem('token');

  const isSocketConnected = useRef(false);

  useEffect(() => {
    if (!channels || isLoading || !token || isSocketConnected.current) return;

    console.log('Подключение к WebSocket...');
    connectSocket(token);
    isSocketConnected.current = true;

    const handleNewMessage = (message) => {
      dispatch(
        dataApi.util.updateQueryData('fetchMessages', message.channelId, (draft) => {
          draft.push(message);
        })
      );
    };

    const handleNewChannel = (newChannel) => {
      dispatch(dataApi.util.invalidateTags(['Channels']));
      dispatch(
        dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
          draft.push(newChannel);
        })
      );
    };

    const handleRemoveChannel = (channelId) => {
      dispatch(dataApi.util.invalidateTags(['Channels', 'Messages']));

      dispatch(
        dataApi.util.updateQueryData('fetchChannels', undefined, (draft) =>
          draft.filter((channel) => channel.id !== channelId)
        )
      );
      dispatch(
        dataApi.util.updateQueryData('fetchMessages', channelId, () => [])
      );

      if (currentChannelId === channelId) {
        dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
      }
    };

    const handleRenameChannel = ({ id, name }) => {
      dispatch(dataApi.util.invalidateTags(['Channels']));

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
      console.log('Отписка от событий WebSocket...');
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleNewChannel);
      socket.off('removeChannel', handleRemoveChannel);
      socket.off('renameChannel', handleRenameChannel);
    };
  }, [dispatch, isLoading, channels, currentChannelId, token]);

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
