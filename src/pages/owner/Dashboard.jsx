import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { Icon, IconButton, Loading, Modal, SecondaryButton, TextMessage } from "../../components";

import useServerRequest from "../../helper/useServerRequest";
import { baseSocketURL } from "../../configrations/backendConfig";
import { setRestaurantWebSocket } from "../../reduxStore/notificationSlice";

export default function Dashboard() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const restaurantWebSocket = useSelector(state => state.notification.restaurantWebSocket);
    const token = useSelector(state => state.auth.token);
    const {restaurant_id} = useParams();
    const sideNavReference = useRef(null);
    const orderNotificationModalReference = useRef(null);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [restaurant, setRestaurant] = useState(null);

    const navigationLinks = [
        {to: "/", icon: "home", text: "Home"},
        {to: "/myrestaurants", icon: "store", text: "All Restaurants"},
        {to: "detail", icon: "wysiwyg", text: "Restauratn Detail"},
        {to: "menu", icon: "fastfood", text: "Restaurant Menu"},
        {to: "order-analysis", icon: "monitoring", text: "Order Summary"},
        {to: "active-orders", icon: "skillet", text: "Active Orders"},
        {to: "new-orders", icon: "notifications_unread", text: "New Orders"},
        {to: "order-history", icon: "rule", text: "Order History"},
        {to: "/account", icon: "person", text: "Account"},
    ]
    

    function handleOpenNav(){
        sideNavReference.current.classList.remove("hidden");
    }

    function handleCloseNav(){
        sideNavReference.current.classList.add("hidden");
    }


    useEffect(()=>{
        if (!token)
            navigate("/");
        else{
            // GET RESTAURANT REQUEST
            (async ()=>{
                const [data, responseStatus] = await serverRequest(`/api/owner/${restaurant_id}/`, "GET");

                if (responseStatus === 200){
                    setRestaurant(data);
                }
                else if (responseStatus === 403){
                    setNewNotification("You are not the Owner!");
                }
                else if (responseStatus === 404){
                    setNewNotification("Restaurant Not Found!");
                }
                else {
                    console.log("Error: ", data);
                    setNewNotification();
                }
            })();
        }
    }, [token])


    useEffect(()=>{
        const restaurantSocket = new WebSocket(`${baseSocketURL}/ws/notification/${restaurant_id}/`);
        restaurantSocket.onopen = (event)=>{
            console.log("restaurant connected");
        }

        restaurantSocket.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            orderNotificationModalReference.current.classList.remove("hidden");
            dispatch(setRestaurantWebSocket(data));
        }

        restaurantSocket.onerror = (event)=>{
            console.log("restaurant error: ", event);
        }

        return ()=>{
            restaurantSocket.close();
        }
    }, [])


    return ( 
        <section className="flex-1 my-8 flex">
            {/* ORDER NOTIFICATION */}
            <Modal reference={orderNotificationModalReference}>

                <div className={`flex gap-2 mb-8 ${restaurantWebSocket?.status_icon === "cancel" ? "text-red-500" : "text-emerald-500"} text-base font-bold`}>
                    <Icon iconName={restaurantWebSocket?.status_icon}/>    
                    <h3>{restaurantWebSocket?.status_text}</h3>
                </div>

                <div className="mb-4">
                    <span className="text-zinc-500 text-sm font-bold">Order ID</span>
                    <h3 className="text-lg md:text-lg">{restaurantWebSocket?.id}</h3>
                </div>

                <SecondaryButton extraCSS="ml-auto" onClick={()=>{
                    orderNotificationModalReference.current.classList.add("hidden");
                    navigate(`/owner/${restaurant.id}/order-detail/${restaurantWebSocket?.id}`);
                }}>View Order</SecondaryButton>
            </Modal>

            <div ref={sideNavReference} className="z-50 lg:z-0 hidden fixed top-0 left-0 right-0 bottom-0 bg-[rgba(255, 255, 255, 0.4)] lg:static lg:block backdrop-blur">
                <div className="sticky top-0 bg-white w-80 lg:w-fit h-full lg:h-fit flex flex-col pr-8 py-8 lg:py-0 lg:pr-0">
                    <IconButton iconName="close" extraCSS="lg:hidden ml-auto" onClick={handleCloseNav}/>
                    
                    {
                        navigationLinks.map( navigationLink => (
                            <NavLink key={navigationLink.text} to={navigationLink.to} onClick={handleCloseNav} className={({isActive})=>(isActive ? "bg-yellow-500" : "bg-transparent") + " flex items-center gap-2 px-8 py-5 text-base rounded-r-[36px]"}>
                                <Icon iconName={navigationLink.icon}/>
                                {navigationLink.text}
                            </NavLink>
                        ))
                    }
                </div>
            </div>

            <div className="flex-1 min-h-96 px-4 md:px-16 lg:ml-8 lg:border-l lg:border-gray-300 mb-36">
                <div className="lg:hidden pb-4 mb-8 border-b border-gray-300">
                    <IconButton iconName="segment" bgColor="bg-gray-200" textColor="text-black" onClick={handleOpenNav}/>
                </div>

                {
                    isProcessing ?
                        <Loading />
                    :
                        restaurant ?
                            <Outlet context={[restaurant, setRestaurant]}/>
                        :
                            <TextMessage message="Restaurant Not Found!" /> 
                }
            </div>
        </section>
     );
}