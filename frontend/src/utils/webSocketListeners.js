import { dataApi } from '../api/dataApi.js';

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

export default initWebSocketListeners;
