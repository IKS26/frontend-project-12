/* eslint-disable no-param-reassign */
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { getState }) => {
    const {
      auth: { token }
    } = getState();
    const response = await axios.get('/api/v1/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { messages: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export default messagesSlice.reducer;
