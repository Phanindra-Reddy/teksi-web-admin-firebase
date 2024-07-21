import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import profileSlice from "./slices/userSlice";
import bookingSlice from "./slices/bookingSlice";

export const createStore = () =>
  configureStore({
    reducer: {
      profile: profileSlice,
      bookings: bookingSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(thunk),
  });

const store = createStore();

export default store;
