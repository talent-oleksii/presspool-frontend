// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers as needed
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
