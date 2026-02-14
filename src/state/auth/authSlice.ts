import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { log } from "console";

type AuthState = {
  isLoading: boolean;
  error?: string;
};

const initialState: AuthState = {
  isLoading: false,
  error: "User not authorized",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signupRequest: (state) => {
      state.isLoading = true;
      state.error = undefined;
    },
    signupSuccess: (state) => {
      state.isLoading = false;
      state.error = undefined;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = undefined;
    },
    loginSuccess: (state) => {
      state.isLoading = false;
      state.error = undefined;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logoutRequest: (state) => {
      state.isLoading = true;
      state.error = undefined
    },
    logoutSuccess: (state) => {
      state.isLoading = false;
      state.error = "User not authorized";
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  },

});

export const AuthActions = {
  signupRequest: createAction<{
    name: string;
    email: string;
    password: string;
  }>("auth/signupRequest"),
  loginRequest: createAction<{ email: string; password: string }>(
    "auth/loginRequest"
  ),
  logoutRequest: createAction("auth/logoutRequest"),
};

export const {
  signupRequest,
  signupSuccess,
  signupFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} = authSlice.actions;
export default authSlice.reducer;
