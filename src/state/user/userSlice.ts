import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserRole = "Manager" | "Admin" | "Normal";

type UserState = {
  name: string;
  email: string;
  userId: string;
  role: UserRole;
  avatar: { fileId: string } | null;
  password?: string;
  profilePictureUpload?: {
    state: "pending" | "uploading" | "done" | "failed";
    progress?: number;
  };
};

type signupResponse = {
  userId: string;
  name: string;
  email: string;
  password: string;
};

type loginResponse = {
  userId: string;
};

const initialState: UserState = {
  name: "",
  email: "",
  userId: "",
  role: "Normal",
  avatar: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signupUser: (state, action: PayloadAction<signupResponse>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
      state.password = action.payload.password;
    },
    setUserID: (state, action: PayloadAction<loginResponse>) => {
      state.userId = action.payload.userId;
    },
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.avatar = action.payload.avatar;
      state.password = action.payload.password;
    },
    clearUser: (state) => {
      state.name = "";
      state.email = "";
      state.userId = "";
    },
    startProfilePictureUpload: (
      state,
      action: PayloadAction<{ file: File, user: UserState }>
    ) => {
      state.profilePictureUpload = { state: "pending", progress: 0 };
    },
    uploadProfilePictureProgress: (
      state,
      action: PayloadAction<{ progress: number }>
    ) => {
      if (state.profilePictureUpload) {
        state.profilePictureUpload.state = "uploading";
        state.profilePictureUpload.progress = action.payload.progress;
      }
    },
    uploadProfilePictureComplete: (
      state,
      action: PayloadAction<{ fileId: string }>
    ) => {
      if (state.profilePictureUpload) {
        state.profilePictureUpload.state = "done";
        state.profilePictureUpload.progress = 100;
      }
    },
    uploadProfilePictureFailed: (state) => {
      if (state.profilePictureUpload) {
        state.profilePictureUpload.state = "failed";
      }
    },
  },
});

export const UserActions = {
  getUserData: createAction<{ userId: string, password: string }>("user/getUserData"),
  updateUser: createAction<UserState>("user/updateUser"),
};

export const {
  signupUser,
  setUserID,
  setUser,
  clearUser,
  startProfilePictureUpload,
  uploadProfilePictureProgress,
  uploadProfilePictureComplete,
  uploadProfilePictureFailed,
} = userSlice.actions;
export default userSlice.reducer;
