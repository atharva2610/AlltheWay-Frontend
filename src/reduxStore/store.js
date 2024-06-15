import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import cityStateCuisineReducer from "./cityStateCuisineSlice";
import notificationReducer from "./notificationSlice";
import userSelectedCityReducer from "./userSelectedCitySlice";
import favoriteRestaurantsReducer from "./favoriteRestaurantsSlice";

export const store = configureStore({
    reducer: {
        auth: userReducer,
        cart: cartReducer,
        cityStateCuisine: cityStateCuisineReducer,
        notification: notificationReducer,
        userSelectedCity: userSelectedCityReducer,
        favoriteRestaurants: favoriteRestaurantsReducer
    }
})