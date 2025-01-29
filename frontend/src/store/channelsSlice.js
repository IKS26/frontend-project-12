/* eslint-disable no-param-reassign */
import { createSelector } from 'reselect';
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

export const DEFAULT_CHANNEL_ID = 1; // ID канала "general"

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: null
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
    addChannel: (state, { payload }) => {
      const { id, name, removable } = payload;
      channelsAdapter.addOne(state, { id, name, removable });
    },
    addChannels: (state, { payload }) => {
      channelsAdapter.setAll(state, payload);

      // Если currentChannelId не установлен, выбираем default-канал
      if (
        !state.currentChannelId ||
        !payload.some((ch) => ch.id === state.currentChannelId)
      ) {
        state.currentChannelId = DEFAULT_CHANNEL_ID;
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

export const selectCurrentChannel = (state) =>
  selectors.selectById(state, state.channels.currentChannelId);

export const selectChannelById = (state, channelId) => {
  if (!channelId) return undefined;
  return selectors.selectById(state, channelId);
};

export default channelsSlice.reducer;
