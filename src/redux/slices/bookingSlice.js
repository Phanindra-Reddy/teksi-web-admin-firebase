import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookignsError: "",
  bookings: null,
  adminNotViwedTripsCount: 0,
};

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setAdminNotViwedTripsCount: (state, action) => {
      state.adminNotViwedTripsCount = action.payload;
    },
  },
});

export const { setBookings, setAdminNotViwedTripsCount } = bookingsSlice.actions;

export default bookingsSlice.reducer;

export const getBookings = (state) => state.bookings.bookings;
export const getAdminNotViwedTripsCount = (state) => state.bookings.adminNotViwedTripsCount;
