import { io } from 'socket.io-client';

const socket = io('http://localhost:5002', {
  path: '/socket.io',
  autoConnect: false,
  transports: ['websocket']
});

socket.on('connect_error', (error) => {
  console.error('Ошибка подключения к WebSocket:', error);
});

socket.on('disconnect', (reason) => {
  console.log('WebSocket disconnected:', reason);
});

export const connectSocket = (token) => {
  socket.auth = { token };
  socket.connect();
};

export const subscribeToEvents = (
  onMessage,
  onChannel,
  onRemoveChannel,
  onRenameChannel
) => {
  socket.on('newMessage', (payload) => {
    console.log('Получено новое сообщение (subscribeToEvents):', payload);
    try {
      onMessage(payload);
    } catch (error) {
      console.error('Error handling newMessage event:', error);
    }
  });

  socket.on('newChannel', (payload) => {
    console.log('Получено новое сообщение (subscribeToEvents):', payload);
    try {
      onChannel(payload);
    } catch (error) {
      console.error('Error handling newChannel event:', error);
    }
  });

  socket.on('removeChannel', (payload) => {
    console.log('Получено новое сообщение (subscribeToEvents):', payload);
    try {
      onRemoveChannel(payload.id);
    } catch (error) {
      console.error('Error handling removeChannel event:', error);
    }
  });

  socket.on('renameChannel', (payload) => {
    console.log('Получено новое сообщение (subscribeToEvents):', payload);
    try {
      onRenameChannel(payload);
    } catch (error) {
      console.error('Error handling renameChannel event:', error);
    }
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
