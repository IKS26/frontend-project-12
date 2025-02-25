import { configureStore } from '@reduxjs/toolkit';
import { dataApi } from '../services/dataApi';
import authReducer from './authSlice';
import modalReducer from './modalSlice';
import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    [dataApi.reducerPath]: dataApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(dataApi.middleware),
});

export default store;
