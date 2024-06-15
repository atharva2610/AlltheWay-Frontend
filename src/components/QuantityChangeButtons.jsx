import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { IconButton } from "./Button";

import { updateRestaurant, addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart } from "../reduxStore/cartSlice";

export default function QuantityChangeButtons({ selectedRestaurantId, itemId, selectedRestaurantName=null}) {

    const cart = useSelector(state => state.cart.cartItems);
    const restaurantId = useSelector(state => state.cart.restaurantId);
    const cartItemCount = useSelector(state => state.cart.cartItemCount);
    const dispatch = useDispatch();

    const [itemQuantity, setItemQuantity] = useState(cart[itemId] ? cart[itemId]: 0);

    function handelAddToCart(){
        // if restaurantId already exist
        if (restaurantId){
            if (itemQuantity < 10){
                // if item belongs to the existing restaurant
                if (restaurantId === selectedRestaurantId){
                    if (itemQuantity === 0){
                        dispatch(addItem(itemId));
                    }
                    else{
                        dispatch(increaseQuantity(itemId));
                    }
                    setItemQuantity(prev => prev+=1);

                }
                // else, ask to remove all cart items & update restaurantId
                else{
                    if (confirm("Item in your cart is from another Restaurant! Do you want remove them, and start new?")){
                        dispatch(clearCart());
                        dispatch(updateRestaurant({restaurantId: selectedRestaurantId, restaurantName:selectedRestaurantName}));
                        dispatch(addItem(itemId));
                        setItemQuantity(prev => prev+=1);
                    }
                }
            }
        }
        // else, update restaurantId to selectedRestaurantId
        else{
            dispatch(updateRestaurant({restaurantId: selectedRestaurantId, restaurantName: selectedRestaurantName}));
            dispatch(addItem(itemId));
            setItemQuantity(1);
        }
    }

    function handleRemoveFromCart(){
        if (itemQuantity > 0){
            if (itemQuantity === 1){
                if (cartItemCount === 1){
                    dispatch(removeItem(itemId));
                    dispatch(updateRestaurant({restaurantId: null, restaurantName: null}));
                }
                else{
                    dispatch(removeItem(itemId));
                }
            }
            else{
                dispatch(decreaseQuantity(itemId));
            }
            setItemQuantity(prev => prev-=1);
        }
    }



    return (
        <div className="flex items-center justify-between gap-2 p-2 border border-gray-300 rounded-[36px]">

            <IconButton bgColor="bg-black" textColor="text-white" hover="" onClick={handleRemoveFromCart} iconName="remove" />

            <span className="px-2 text-2xl leading-none">{itemQuantity}</span>

            <IconButton bgColor="bg-black" textColor="text-white" hover="" onClick={handelAddToCart} iconName="add" />

        </div>
    );
}