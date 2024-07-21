import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  email: "",
  name: "",
  mobile: "",
  refreshStatus: "idle",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setMobile: (state, action) => {
      state.mobile = action.payload;
    },
    setRefreshStatus: (state, action) => {
      state.refreshStatus = action.payload;
    },
  },
});

export const { setIsLoggedIn, setName, setEmail, setMobile, setRefreshStatus } =
  profileSlice.actions;

export default profileSlice.reducer;

export const getRefreshStatus = (state) => state.profile.refreshStatus;
export const getIdLoggedIn = (state) => state.profile.isLoggedIn;
