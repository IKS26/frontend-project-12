import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer
  }
});

export default store;
