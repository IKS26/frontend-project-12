import { configureStore } from '@reduxjs/toolkit';
import { dataApi } from '../services/dataApi.js';
import authReducer from './authSlice.js';
import modalReducer from './modalSlice.js';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    [dataApi.reducerPath]: dataApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dataApi.middleware)
});

export default store;
