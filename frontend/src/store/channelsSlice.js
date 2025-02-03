/* eslint-disable no-param-reassign */
import { createSelector } from 'reselect';
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

export const DEFAULT_CHANNEL_ID = 1; // ID канала "general"

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  channels: [],
  currentChannelId: DEFAULT_CHANNEL_ID
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannelId: (state, { payload }) => {
      console.log('Смена канала на:', payload);
      state.currentChannelId = String(payload);
    },
    addChannel: (state, { payload }) => {
      const { id, name, removable } = payload;
      console.log('Добавление канала в store:', payload);
      channelsAdapter.addOne(state, { id, name, removable });
      state.currentChannelId = id;
    },
    addChannels: (state, { payload }) => {
      console.log('addChannels вызван, payload:', payload);
      channelsAdapter.setAll(state, payload);

      if (!state.currentChannelId) {
        const firstChannel = payload[0]?.id ?? DEFAULT_CHANNEL_ID;
        console.log('Устанавливаем currentChannelId:', firstChannel);
        state.currentChannelId = firstChannel;
      }
    },

    removeChannel: (state, { payload: id }) => {
      channelsAdapter.removeOne(state, id);

      if (state.currentChannelId === id) {
        state.currentChannelId = DEFAULT_CHANNEL_ID;
      }
    },
    updateChannel: channelsAdapter.updateOne
  }
});

export const {
  setCurrentChannelId,
  addChannels,
  addChannel,
  removeChannel,
  updateChannel
} = channelsSlice.actions;

export const selectors = channelsAdapter.getSelectors(
  (state) => state.channels
);

export const selectChannels = (state) => selectors.selectAll(state);

export const selectAllChannelNames = createSelector(
  [selectChannels],
  (channels) => channels.map((channel) => channel.name)
);

export const selectCurrentChannelId = (state) =>
  state.channels.currentChannelId;

export const selectCurrentChannel = (state) => {
  const channel =
    state.channels.entities[state.channels.currentChannelId] || null;
  console.log('Текущий канал в selectCurrentChannel:', channel);
  return channel;
};

export const selectChannelById = (state, channelId) => {
  if (!channelId) return undefined;
  return selectors.selectById(state, channelId);
};

export default channelsSlice.reducer;
