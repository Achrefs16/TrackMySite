import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};
export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    isAuthenticated: false,
    details: null, // Object to store user details (name, email, id)
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
      state.details = decodeToken(action.payload.token); // Decode and store user details
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.details = null;
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;

export default userSlice.reducer;
