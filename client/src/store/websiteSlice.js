// Import createSlice from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  selectedWebsite: null, // This will store the selected website's data
};

// Create a slice for the websites with reducers to handle selecting and clearing the selected website
const websiteSlice = createSlice({
  name: "website",
  initialState,
  reducers: {
    // Action to set the selected website
    setSelectedWebsite: (state, action) => {
      state.selectedWebsite = action.payload;
    },
    // Action to clear the selected website
    clearSelectedWebsite: (state) => {
      state.selectedWebsite = null;
    },
  },
});

// Export the reducer and actions
export const { setSelectedWebsite, clearSelectedWebsite } =
  websiteSlice.actions;
export default websiteSlice.reducer;
