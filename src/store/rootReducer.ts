// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dataReducer from "./dataSlice";
import notificationSlice from "./notificationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
  notification: notificationSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
