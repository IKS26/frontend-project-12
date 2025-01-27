/* eslint-disable no-param-reassign */
import { createSelector } from 'reselect';
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit';
import api from '../services/api.js';
import { removeChannel } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState({
  status: 'idle',
  error: null
});

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { getState }) => {
    const { currentChannelId } = getState().channels;
    const response = await api.get('/messages');
    return response.data.filter(
      (message) => message.channelId === currentChannelId
    );
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ body, channelId, username }) => {
    const response = await api.post('/messages', { body, channelId, username });
    return response.data;
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    setMessages: messagesAdapter.setAll
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        messagesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(sendMessage.pending, (state) => {
        state.status = 'sending';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        messagesAdapter.addOne(state, action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(removeChannel.fulfilled, (state, action) => {
        const channelId = action.payload;
        const messagesToRemove = Object.values(state.entities)
          .filter((message) => message.channelId === channelId)
          .map((message) => message.id);
        messagesAdapter.removeMany(state, messagesToRemove);
      });
  }
});

export const { addMessage, setMessages } = messagesSlice.actions;

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
