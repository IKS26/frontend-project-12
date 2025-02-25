import { io } from 'socket.io-client';

const socket = io();

let isConnected = false;

export const connectSocket = () => {
  if (isConnected) {
    return;
  }
  socket.connect();
  isConnected = true;
};

export const disconnectSocket = () => {
  if (!isConnected) {
    return;
  }
  socket.disconnect();
  isConnected = false;
};

export const subscribeToEvents = (
  onMessage,
  onChannel,
  onRemoveChannel,
  onRenameChannel,
) => {
  socket.on('newMessage', onMessage);
  socket.on('newChannel', onChannel);
  socket.on('removeChannel', onRemoveChannel);
  socket.on('renameChannel', onRenameChannel);
};

export default socket;
