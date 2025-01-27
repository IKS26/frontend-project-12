/* eslint-disable no-param-reassign */
import { createSelector } from 'reselect';
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit';
import api from '../services/api.js';

export const DEFAULT_CHANNEL_ID = 1; // ID дефолтного канала

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: DEFAULT_CHANNEL_ID,
  status: 'idle',
  error: null
});

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const response = await api.get('/channels');
    return response.data;
  }
);

export const addNewChannel = createAsyncThunk(
  'channels/addNewChannel',
  async (newChannel) => {
    const response = await api.post('/channels', newChannel);
    return response.data;
  }
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (channelId) => {
    await api.delete(`/channels/${channelId}`);
    return channelId;
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }) => {
    const response = await api.patch(`/channels/${id}`, { name });
    return response.data;
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
      console.log('Текущий канал изменён на:', payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        channelsAdapter.setAll(state, action.payload);
        state.currentChannelId = action.payload[0]?.id || DEFAULT_CHANNEL_ID;
        console.log('Текущий канал после загрузки:', state.currentChannelId);
        state.status = 'succeeded';
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(addNewChannel.fulfilled, (state, action) => {
        channelsAdapter.addOne(state, action.payload);
        state.currentChannelId = action.payload.id; // Переключение создателя в новый канал
      })

      .addCase(removeChannel.fulfilled, (state, action) => {
        const removedChannelId = action.payload;
        channelsAdapter.removeOne(state, removedChannelId);

        if (state.currentChannelId === removedChannelId) {
          state.currentChannelId = DEFAULT_CHANNEL_ID; // Переключение на дефолтный канал
        }
      })

      .addCase(renameChannel.fulfilled, (state, action) => {
        const { id, name } = action.payload;
        channelsAdapter.updateOne(state, { id, changes: { name } });
      })

      .addCase(renameChannel.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const { setCurrentChannelId } = channelsSlice.actions;

export const selectors = channelsAdapter.getSelectors(
  (state) => state.channels
);

export const selectAllChannels = (state) => selectors.selectAll(state);

export const selectAllChannelNames = createSelector(
  [selectAllChannels],
  (channels) => channels.map((channel) => channel.name)
);

export const selectCurrentChannel = (state) =>
  selectors.selectById(state, state.channels.currentChannelId);

export const selectChannelById = (state, id) => selectors.selectById(state, id);

export const selectCurrentChannelId = (state) =>
  state.channels.currentChannelId;

export default channelsSlice.reducer;
