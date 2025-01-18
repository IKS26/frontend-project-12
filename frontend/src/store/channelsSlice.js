/* eslint-disable no-param-reassign */
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { getState }) => {
    const {
      auth: { token }
    } = getState();
    const response = await axios.get('/api/v1/channels', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: { channels: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export default channelsSlice.reducer;
