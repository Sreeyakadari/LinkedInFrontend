// File: src/config/redux/reducer/authReducer.js

import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getAboutUser,
  logoutUser,
} from "@/config/redux/action/authAction";

const tokenFromStorage =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const userFromStorage =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user"))
    : null;

const initialState = {
  token: tokenFromStorage,
  user: userFromStorage,
  loggedIn: !!tokenFromStorage,
  profileFetched: false,
  isLoading: false,
  isError: false,
  message: { message: "" },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    emptyMessage: (state) => {
      state.message = { message: "" };
    },
    setTokenIsThere: (state) => {
      state.loggedIn = true;
    },
    setTokenIsNotThere: (state) => {
      state.loggedIn = false;
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loggedIn = true;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getAboutUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileFetched = true;
        state.user = action.payload.user || state.user;
      })
      .addCase(getAboutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.loggedIn = false;
        state.profileFetched = false;
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.message = { message: "Registered successfully. Please sign in." };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { emptyMessage, setTokenIsThere, setTokenIsNotThere } =
  authSlice.actions;
export default authSlice.reducer;
