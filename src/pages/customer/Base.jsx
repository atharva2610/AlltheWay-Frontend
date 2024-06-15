import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Icon, MainNav, Modal, SecondaryButton } from "../../components";
import { baseSocketURL } from "../../configrations/backendConfig";
import { setCart } from "../../reduxStore/cartSlice";
import { setFavorites } from "../../reduxStore/favoriteRestaurantsSlice";
import { setCustomerWebSocket } from "../../reduxStore/notificationSlice";


export default function Base(){

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const customerWebSocket = useSelector(state => state.notification.customerWebSocket);
    const favoriteRestaurants = useSelector(state => state.favoriteRestaurants.favorites);
    const restaurantId = useSelector(state => state.cart.restaurantId);
    const restaurantName = useSelector(state => state.cart.restaurantName);
    const itemsCount = useSelector(state => state.cart.cartItemCount);
    const cart = useSelector(state => state.cart.cartItems);
    const orderNotificationModalReference = useRef(null);

    window.onbeforeunload = ()=>{
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("restaurantId", restaurantId ? restaurantId : "");
        localStorage.setItem("restaurantName", restaurantName ? restaurantName : "");
        localStorage.setItem("itemsCount", JSON.stringify(itemsCount));
        localStorage.setItem("favorites", JSON.stringify(favoriteRestaurants));
    }

    useEffect(()=>{
        // LOAD CART FROM LOCAL STORAGE
        if (!restaurantId){
            const cartDetail = {
                cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : null,
                itemsCount: localStorage.getItem("itemsCount") ? JSON.parse(localStorage.getItem("itemsCount")) : null,
                restaurantId: localStorage.getItem("restaurantId"),
                restaurantName: localStorage.getItem("restaurantName"),
            };

            if (cartDetail.restaurantId)
                dispatch(setCart(cartDetail));
        }
        // LOAD FAVORITE RESTAURANTS LIST FROM LOCAL STORAGE
        if (localStorage.getItem("favorites"))
            dispatch(setFavorites(JSON.parse(localStorage.getItem("favorites"))));
    }, [])

    const user = useSelector(state => state.auth.user);

    useEffect(()=>{
        const customerSocket = new WebSocket(`${baseSocketURL}/ws/notification/${user?.id}/`);

        customerSocket.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            dispatch(setCustomerWebSocket(data));
            orderNotificationModalReference.current.classList.remove("hidden");
        }

        customerSocket.onerror = (event)=>{
            console.log("socket error");
        }

        return ()=>{
            customerSocket.close();
        }
    }, [user])

    return (
        <>
            {/* ORDER NOTIFICATION */}
            <Modal reference={orderNotificationModalReference}>

                <div className={`flex gap-2 mb-8 ${customerWebSocket?.status_icon === "cancel" ? "text-red-500" : "text-emerald-500"} text-base font-bold`}>
                    <Icon iconName={customerWebSocket?.status_icon}/>    
                    <h3>{customerWebSocket?.status_text}</h3>
                </div>

                <div className="mb-4">
                    <span className="text-zinc-500 text-sm font-bold">Order ID</span>
                    <h3 className="text-lg md:text-lg">{customerWebSocket?.id}</h3>
                </div>

                <SecondaryButton extraCSS="ml-auto" onClick={()=>{
                    orderNotificationModalReference.current.classList.add("hidden");
                    navigate(`orders/${customerWebSocket.id}`);
                }}>View Order</SecondaryButton>
            </Modal>

            <MainNav/>
            
            <main className="min-h-96 flex-1 px-4 sm:px-8 md:px-16 lg:px-36 mb-36">
                <Outlet/>
            </main>
        </>
    )
}