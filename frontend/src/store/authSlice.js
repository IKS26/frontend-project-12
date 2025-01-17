import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const token = action.payload;
      localStorage.setItem('token', token);
      return {
        ...state,
        isAuthenticated: true,
        token
      };
    },
    logout(state) {
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        token: null
      };
    }
  }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
