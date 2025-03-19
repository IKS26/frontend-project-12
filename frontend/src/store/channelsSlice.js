/* eslint-disable no-param-reassign */
import { createSelector } from 'reselect';
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { selectModalState } from './modalSlice';

export const DEFAULT_CHANNEL_ID = 1;

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
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
      channelsAdapter.addOne(state, payload);
      state.currentChannelId = payload.id;
    },
    addChannels: (state, { payload }) => {
      channelsAdapter.setAll(state, payload);
      if (!state.currentChannelId) {
        state.currentChannelId = payload.length > 0 ? payload[0].id : DEFAULT_CHANNEL_ID;
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
export const { selectAll: selectChannels, selectById } = selectors;

export const selectCurrentChannelId = (state) => state.channels.currentChannelId;
export const selectCurrentChannel = (state) => selectById(state, selectCurrentChannelId(state)) || null;

export const selectCurrentChannelById = (state) => selectById(state, selectModalState(state)?.channelId) || null;

export const selectAllChannelNames = createSelector(
  [selectChannels],
  (channels) => channels.map((channel) => channel.name),
);

export default channelsSlice.reducer;
