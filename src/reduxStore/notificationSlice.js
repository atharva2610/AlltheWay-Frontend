import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    customerWebSocket: null,
    restaurantWebSocket: null
}

export const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter((notification, index) => index !== action.payload);
        },
        setCustomerWebSocket: (state, action) => {
            state.customerWebSocket = action.payload;
        },
        setRestaurantWebSocket: (state, action) => {
            state.restaurantWebSocket = action.payload;
        }
    }
})

export const { addNotification, removeNotification, setCustomerWebSocket, setRestaurantWebSocket } = notificationSlice.actions;

export default notificationSlice.reducer