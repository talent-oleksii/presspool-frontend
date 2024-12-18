// authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  // state for client.
  isAuthenticated: boolean;
  email: string;
  name: string;
  fullName: string;
  company: string;
  verified: string;
  token: string;
  email_verified: string;
  avatar: string;
  createTime: number;
  domain: string;

  //state for admin.
  isAdminAuthenticated: boolean;
  adminToken: string;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  adminId: string;
  adminLink: string;
  adminCreateTime: number;

  //state for creator.
  isCreatorAuthenticated: boolean;
  creatorToken: string;
  creatorData: any;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  email: localStorage.getItem("email") || "",
  name: localStorage.getItem("name") || "",
  fullName: localStorage.getItem("fullName") || "",
  company: localStorage.getItem("company") || "",
  verified: localStorage.getItem("verified") || "",
  token: localStorage.getItem("token") || "",
  email_verified: localStorage.getItem("email_verified") || "",
  avatar: localStorage.getItem("avatar") || "",
  createTime: 0,
  domain: "",
  // date for admin.
  isAdminAuthenticated: localStorage.getItem("isAdminAuthenticated") === "true",
  adminToken: localStorage.getItem("adminToken") || "",
  adminName: localStorage.getItem("adminName") || "",
  adminEmail: localStorage.getItem("adminEmail") || "",
  adminRole: localStorage.getItem("adminRole") || "",
  adminId: localStorage.getItem("adminId") || "",
  adminLink: localStorage.getItem("adminLink") || "",
  adminCreateTime: 0,
  isCreatorAuthenticated:
    localStorage.getItem("isCreatorAuthenticated") === "true",
  creatorToken: localStorage.getItem("creatorToken") || "",
  creatorData: localStorage.getItem("creatorData")
    ? JSON.parse(localStorage.getItem("creatorData") ?? "")
    : "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("creatorToken");
      state.isAdminAuthenticated = false;
      state.isCreatorAuthenticated = false;
    },
    setUnauthenticated: (state) => {
      state.isAuthenticated = false;
      localStorage.setItem("isAuthenticated", "false");
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },
    setUserData: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.fullName = action.payload.fullName;
      state.company = action.payload.company;
      state.verified = action.payload.verified;
      state.email_verified = action.payload.email_verified;
      state.avatar = action.payload.avatar;
      state.createTime = action.payload.createTime;
      state.domain = action.payload.domain;
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("name", action.payload.name);
      localStorage.setItem("fullName", action.payload.fullName);
      localStorage.setItem("company", action.payload.company);
      localStorage.setItem("verified", action.payload.verified);
      localStorage.setItem("email_verified", action.payload.email_verified);
      localStorage.setItem("avatar", action.payload.avatar);
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload.avatar;
      localStorage.setItem("avatar", action.payload.avatar);
    },

    // For admin
    setAdminAuthenticated: (state, action) => {
      state.isAuthenticated = false;
      state.isCreatorAuthenticated = false;
      state.isAdminAuthenticated = action.payload.state;
      localStorage.setItem(
        "isAdminAuthenticated",
        action.payload.state ? "true" : "false"
      );
    },
    setAdminToken: (state, action) => {
      state.adminToken = action.payload.token;
      localStorage.setItem("adminToken", action.payload.token);
      localStorage.removeItem("token");
      localStorage.removeItem("creatorToken");
    },
    setAdminUserData: (state, action) => {
      state.adminName = action.payload.userName;
      state.adminEmail = action.payload.email;
      state.adminRole = action.payload.role;
      state.adminId = action.payload.id;
      state.adminLink = action.payload.link;
      state.adminCreateTime = action.payload.adminCreateTime;
      localStorage.setItem("adminName", action.payload.userName);
      localStorage.setItem("adminEmail", action.payload.email);
      localStorage.setItem("adminRole", action.payload.role);
      localStorage.setItem("adminId", action.payload.id);
      localStorage.setItem("adminLink", action.payload.link);
    },
    setCreatorData: (state, action) => {
      state.isCreatorAuthenticated = true;
      state.isAuthenticated = false;
      state.isAdminAuthenticated = false;
      state.creatorToken = action.payload.token;
      state.creatorData = action.payload;
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.setItem("creatorToken", action.payload.token);
      localStorage.setItem("creatorData", JSON.stringify(action.payload));
      localStorage.setItem(
        "isCreatorAuthenticated",
        action.payload.state ? "true" : "false"
      );
    },
  },
});

export const {
  // For Client
  setAuthenticated,
  setUnauthenticated,
  setUserData,
  setToken,
  setAvatar,
  // For Admin,
  setAdminAuthenticated,
  setAdminToken,
  setAdminUserData,
  // For creator
  setCreatorData,
} = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
