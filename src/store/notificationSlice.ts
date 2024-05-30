import { createSlice } from "@reduxjs/toolkit";

interface NotificationState {
  data: any;
}

const initialState: NotificationState = {
  data: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setNotifications } = notificationSlice.actions;
export const notificationData = (state: { notification: NotificationState }) =>
  state.notification;
export default notificationSlice.reducer;
