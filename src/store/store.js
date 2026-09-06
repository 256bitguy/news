import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './newsSlice.js';
import authReducer from './authSlice.js';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    auth: authReducer,
  },
});
