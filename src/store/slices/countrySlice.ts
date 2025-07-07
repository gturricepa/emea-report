import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CountryState {
  selectedCountry: string;
}

const initialState: CountryState = {
  selectedCountry: "all",
};

export const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setSelectedCountry(state, action: PayloadAction<string>) {
      state.selectedCountry = action.payload;
    },
  },
});

export const { setSelectedCountry } = countrySlice.actions;

export default countrySlice.reducer;
