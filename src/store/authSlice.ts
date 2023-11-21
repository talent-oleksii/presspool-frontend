// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  email: string;
  name: string;
  fullName: string;
  company: string;
  verified: string;
  token: string;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  email: localStorage.getItem('email') || '',
  name: localStorage.getItem('name') || '',
  fullName: localStorage.getItem('fullName') || '',
  company: localStorage.getItem('company') || '',
  verified: localStorage.getItem('verified') || '',
  token: localStorage.getItem('token') || '',
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
    setToken: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    setUserData: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.fullName = action.payload.fullName;
      state.company = action.payload.company;
      state.verified = action.payload.verified;
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('name', action.payload.name);
      localStorage.setItem('fullName', action.payload.fullName);
      localStorage.setItem('company', action.payload.company);
      localStorage.setItem('verified', action.payload.verified);
    },
  },
});

export const { setAuthenticated, setUnauthenticated, setUserData, setToken } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
