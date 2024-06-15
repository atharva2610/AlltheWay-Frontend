import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    favorites: []
}

export const favoriteRestaurantsSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        addToFavorite: (state, action) => {
            state.favorites.push(action.payload);
        },
        removeFromFavorite: (state, action) => {
            state.favorites = state.favorites.filter(restaurantId => restaurantId !== action.payload);
        },
        setFavorites: (state, action) => {
            state.favorites = action.payload;
        }
    }
})

export const { addToFavorite, removeFromFavorite, setFavorites } = favoriteRestaurantsSlice.actions;

export default favoriteRestaurantsSlice.reducer