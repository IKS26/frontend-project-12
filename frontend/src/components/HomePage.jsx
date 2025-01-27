import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMessages,
  addMessage,
  selectAllMessages,
} from '../store/messagesSlice.js';
import {
  fetchChannels,
  addNewChannel,
  removeChannel,
  renameChannel,
  selectAllChannels,
  selectCurrentChannelId,
} from '../store/channelsSlice.js';
import { selectModalState } from '../store/modalSlice.js';
import socket, {
  connectSocket,
  subscribeToEvents,
  disconnectSocket,
} from '../services/socket.js';
import ChannelsList from './ChannelsList.jsx';
import MessagesBox from './MessagesBox.jsx';
import MessageInput from './MessageInput.jsx';
import Modal from './modals/index.jsx';

const HomePage = () => {
  const dispatch = useDispatch();

  const channels = useSelector(selectAllChannels);
  const messages = useSelector(selectAllMessages);
  console.log('messages:', messages);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const modalState = useSelector(selectModalState);

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      await dispatch(fetchChannels());
      connectSocket(localStorage.getItem('token'));
    };

    initializeData();

    const handleNewMessage = (response) => {
      console.log('Получено новое сообщение (useEffect):', response.data);
      dispatch(addMessage(response.data));
    };
    const handleNewChannel = (channel) => dispatch(addNewChannel(channel));
    const handleRemoveChannel = (channelId) => dispatch(removeChannel(channelId));
    const handleRenameChannel = (channel) => dispatch(renameChannel(channel));

    subscribeToEvents(handleNewMessage, handleNewChannel, handleRemoveChannel, handleRenameChannel);

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    return () => {
      disconnectSocket();
    };
  }, [dispatch]);

  // Загрузка сообщений при смене канала
  useEffect(() => {
    dispatch(fetchMessages(currentChannelId));
  }, [dispatch, currentChannelId]);

  // Обработчик отправки сообщения
  const handleSendMessage = (newMessage) => {
      console.log('Отправка сообщения:', newMessage);
		console.log('Текущий канал:', currentChannelId);
      setIsSending(true);

      socket.emit(
        'newMessage',
        {
          body: newMessage,
          channelId: currentChannelId,
          username: localStorage.getItem('username'),
        },
        (response) => {
          console.log('Ответ сервера:', response);
          if (response && response.status === 'ok') {
            console.log('Сообщение отправлено успешно');
          } else {
            console.log('Ошибка при отправке сообщения');
          }
          setIsSending(false);
        }
      );
    };

  const shouldRenderModal = useMemo(() => modalState.isOpen && modalState.type, [modalState]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 flex-md-row chat-bg">
        <div className="col-4 col-md-2 border-end px-0 flex-column h-100 d-flex channels-bg">
          <ChannelsList
            channels={channels}
            currentChannelId={currentChannelId}
          />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <MessagesBox
              messages={messages}
              channels={channels}
              currentChannelId={currentChannelId}
            />
            <MessageInput
              handleSendMessage={handleSendMessage}
              isSending={isSending}
            />
          </div>
        </div>
      </div>
      {shouldRenderModal && <Modal />}
    </div>
  );
};

export default HomePage;
