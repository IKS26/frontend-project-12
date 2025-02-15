import { io } from 'socket.io-client';

const socket = io('http://localhost:5001', {
  transports: ['websocket', 'polling']
});

let isConnected = false;

export const connectSocket = (token) => {
  if (isConnected) {
    console.warn('WebSocket уже подключен');
    return;
  }
  socket.auth = { token };
  socket.connect();
  isConnected = true;

  socket.on('connect', () => {
    console.log('WebSocket подключен');
  });
};

export const disconnectSocket = () => {
  if (!isConnected) {
    console.warn('WebSocket уже отключён');
    return;
  }
  socket.disconnect();
  isConnected = false;
  console.log('WebSocket отключён');
};

export const subscribeToEvents = (
  onMessage,
  onChannel,
  onRemoveChannel,
  onRenameChannel
) => {
  socket.on('newMessage', onMessage);
  socket.on('newChannel', onChannel);
  socket.on('removeChannel', onRemoveChannel);
  socket.on('renameChannel', onRenameChannel);
};

export default socket;
