import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedCity: null,
}

export const userSelectedCitySlice = createSlice({
    name: "userSelectedCity",
    initialState,
    reducers: {
        setSelectedCity: (state, action) => {
            state.selectedCity = action.payload;
        }
    }
})

export const { setSelectedCity } = userSelectedCitySlice.actions;

export default userSelectedCitySlice.reducer