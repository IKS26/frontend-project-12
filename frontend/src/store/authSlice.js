/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'token';
const USERNAME_KEY = 'username';

const initialState = {
  token: localStorage.getItem(TOKEN_KEY) || null,
  username: localStorage.getItem(USERNAME_KEY) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { token, username } = action.payload;
      state.token = token;
      state.username = username;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USERNAME_KEY, username);
    },
    logout(state) {
      state.token = null;
      state.username = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USERNAME_KEY);
    },
  },
});

export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
