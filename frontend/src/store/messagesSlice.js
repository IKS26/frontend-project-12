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
      const remainingMessages = Object.values(state.entities).filter(
        (message) => message.channelId !== channelId
      );
      messagesAdapter.setAll(state, remainingMessages);
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
  (messages, currentChannelId) =>
    messages.filter((message) => message.channelId === currentChannelId)
);

export default messagesSlice.reducer;
