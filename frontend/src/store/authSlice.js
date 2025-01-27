/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'token';

const initialState = {
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  token: localStorage.getItem(TOKEN_KEY) || null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem(TOKEN_KEY, action.payload);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.clear();
    }
  }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
