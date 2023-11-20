// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  email: string;
  name: string;
  fullName: string;
  company: string;
  verified: string;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  email: localStorage.getItem('email') || '',
  name: localStorage.getItem('name') || '',
  fullName: localStorage.getItem('fullName') || '',
  company: localStorage.getItem('company') || '',
  verified: localStorage.getItem('verified') || '',
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
    setUserData: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('name', action.payload.name);
      localStorage.setItem('fullName', action.payload.fullName);
      localStorage.setItem('company', action.payload.company);
      localStorage.setItem('verified', action.payload.verified);
    },
  },
});

export const { setAuthenticated, setUnauthenticated, setUserData } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
