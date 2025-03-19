/* eslint-disable no-param-reassign */
import { createSelector } from 'reselect';
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { selectModalState } from './modalSlice';

export const DEFAULT_CHANNEL_ID = 1;

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  channels: [],
  currentChannelId: DEFAULT_CHANNEL_ID,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = String(payload);
    },
    addChannel: (state, { payload }) => {
      const { id, name, removable } = payload;
      channelsAdapter.addOne(state, { id, name, removable });

      state.currentChannelId = id;
    },
    addChannels: (state, { payload }) => {
      channelsAdapter.setAll(state, payload);
      if (!state.currentChannelId) {
        const firstChannel = payload.length > 0 ? payload[0].id : DEFAULT_CHANNEL_ID;
        state.currentChannelId = firstChannel;
      }
    },
    removeChannel: (state, { payload: id }) => {
      channelsAdapter.removeOne(state, id);
      if (state.currentChannelId === id) {
        state.currentChannelId = DEFAULT_CHANNEL_ID;
      }
    },
    updateChannel: channelsAdapter.updateOne,
  },
});

export const {
  setCurrentChannelId,
  addChannels,
  addChannel,
  removeChannel,
  updateChannel,
} = channelsSlice.actions;

export const selectors = channelsAdapter.getSelectors((state) => state.channels);

export const selectChannels = (state) => selectors.selectAll(state);

export const selectAllChannelNames = createSelector(
  [selectChannels],
  (channels) => channels.map((channel) => channel.name),
);

export const selectCurrentChannelId = (state) => state.channels.currentChannelId;

export const selectCurrentChannel = createSelector(
  [(state) => state.channels.currentChannelId, (state) => state.channels.entities],
  (currentChannelId, entities) => entities[currentChannelId] || null,
);

export const selectCurrentChannelById = createSelector(
  [selectModalState, (state) => state.channels.entities],
  (modal, entities) => entities[modal.channelId] || null,
);

export default channelsSlice.reducer;
