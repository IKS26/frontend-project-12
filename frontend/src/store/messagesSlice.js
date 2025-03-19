import { createSelector } from 'reselect';
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    removeMessagesByChannelId: (state, { payload: channelId }) => {
      const idsToRemove = Object.values(state.entities)
        .filter((message) => message.channelId === channelId)
        .map((message) => message.id);

      messagesAdapter.removeMany(state, idsToRemove);
    },
  },
});

export const {
  addMessage,
  addMessages,
  removeMessagesByChannelId,
} = messagesSlice.actions;

export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export const { selectAll: selectAllMessages } = selectors;

export const selectCurrentChannelMessages = createSelector(
  [selectAllMessages, (state) => state.channels.currentChannelId],
  (messages, currentChannelId) => messages.filter(
    (message) => message.channelId === currentChannelId,
  ),
);

export default messagesSlice.reducer;
