/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  channelId: null,
  isOpen: false
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      if (state.isOpen) return;
      const { type, channelId = null } = action.payload;
      state.type = type;
      state.channelId = channelId;
      state.isOpen = true;
    },
    closeModal: (state) => {
      if (!state.isOpen) return;
      state.type = null;
      state.channelId = null;
      state.isOpen = false;
    }
  }
});

export const selectModalState = (state) => state.modal;

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
