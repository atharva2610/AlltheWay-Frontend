import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    restaurantId: null,
    restaurantName: null,
    item_amount: 0,
    total_amount: 0,
    cartItemCount: 0,
    cartItems: {} // stores items added to the cart, example itemId: {itemObject}
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        updateRestaurant: (state, action) => {
            state.restaurantId = action.payload.restaurantId;
            state.restaurantName = action.payload.restaurantName;
        },
        addItem: (state, action) => {
            state.cartItems[action.payload] = 1;
            state.cartItemCount += 1;
        },
        removeItem: (state, action) => {
            delete state.cartItems[action.payload];
            state.cartItemCount -= 1;
        },
        increaseQuantity: (state, action) => {
            state.cartItems[action.payload] += 1;
        },
        decreaseQuantity: (state, action) => {
            state.cartItems[action.payload] -= 1;
        },
        setAmount: (state, action)=>{
            state.item_amount = action.payload.item_amount;
            state.total_amount = action.payload.total_amount;
        },
        clearCart: (state, action) => {
            state.cartItems = {};
            state.cartItemCount = 0;
            state.restaurantId = null;
            state.restaurantName = null;
            state.item_amount = 0;
            state.total_amount = 0;
        },
        setCart: (state, action) => {
            state.cartItems = action.payload.cart;
            state.cartItemCount = action.payload.itemsCount;
            state.restaurantId = action.payload.restaurantId;
            state.restaurantName = action.payload.restaurantName;
        }
    }
})

export const { updateRestaurant, addItem, removeItem, increaseQuantity, decreaseQuantity, setAmount, clearCart, setCart } = cartSlice.actions;

export default cartSlice.reducer;