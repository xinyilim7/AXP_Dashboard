// central coordinator
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';

// Combine all your feature reducers here
const rootReducer = {
  dashboard: dashboardReducer,
  // If you add a user feature later: user: userReducer,
};

const store = configureStore({
  reducer: rootReducer,
  // configureStore automatically adds thunk middleware and DevTools support
});

export default store;