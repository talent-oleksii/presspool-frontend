// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  email: string;
  name: string;
  fullName: string;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  email: localStorage.getItem('email') || '',
  name: localStorage.getItem('name') || '',
  fullName: localStorage.getItem('fullName') || '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
    },
    setUnauthenticated: (state) => {
      state.isAuthenticated = false;
      localStorage.setItem('isAuthenticated', 'false');
    },
    setEmail: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      console.log('actio:', action.payload);
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('name', action.payload.name);
      localStorage.setItem('fullName', action.payload.fullName);
    },
  },
});

export const { setAuthenticated, setUnauthenticated, setEmail } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
