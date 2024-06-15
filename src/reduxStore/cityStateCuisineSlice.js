import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cities: [],
    states: [],
    cuisines: []
}

export const cityStateCuisineSlice = createSlice({
    name: "cityStateCuisine",
    initialState,
    reducers: {
        setCities: (state, action) => {
            state.cities = action.payload;
        },
        setStates: (state, action) => {
            state.states = action.payload;
        },
        setCuisines: (state, action) => {
            state.cuisines = action.payload;
        }
    }
})

export const { setCities, setStates, setCuisines } = cityStateCuisineSlice.actions;

export default cityStateCuisineSlice.reducer