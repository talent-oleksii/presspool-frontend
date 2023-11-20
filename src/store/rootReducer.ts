// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dataReducer from './dataSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
  // Add other reducers as needed
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
