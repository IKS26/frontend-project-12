import { createSelector } from 'reselect';
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      console.log('Добавление сообщения в store:', action.payload);
      messagesAdapter.addOne(state, action.payload);
    },
    addMessages: messagesAdapter.addMany,
    removeMessagesByChannelId: (state, { payload: channelId }) => {
      const idsToRemove = Object.values(state.entities)
        .filter((message) => message.channelId === channelId)
        .map((message) => message.id);

      messagesAdapter.removeMany(state, idsToRemove);
    }
  }
});

export const { addMessage, addMessages, removeMessagesByChannelId } =
  messagesSlice.actions;

export const selectors = messagesAdapter.getSelectors(
  (state) => state.messages
);

export const selectAllMessages = (state) => selectors.selectAll(state);

export const selectCurrentChannelMessages = createSelector(
  [
    (state) => selectAllMessages(state),
    (state) => state.channels.currentChannelId
  ],
  (messages, currentChannelId) => {
    const filteredMessages = messages.filter(
      (message) => message.channelId === currentChannelId
    );
    console.log(`Сообщения для канала ${currentChannelId}:`, filteredMessages);
    return filteredMessages;
  }
);

export default messagesSlice.reducer;
