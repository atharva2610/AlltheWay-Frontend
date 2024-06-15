import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from "react-redux";
import { OrderCard, TextMessage, Loading } from "../../components";

import useServerRequest from "../../helper/useServerRequest";

export default function ActiveOrders(){

    const navigate = useNavigate();
    const restaurantWebSocket = useSelector(state => state.notification.restaurantWebSocket);
    const [restaurant, setRestaurant] = useOutletContext();

    const [isProcessingOrders, setNewNotification, serverRequest] = useServerRequest();
    const [orders, setOrders] = useState(null);


    function handleViewDetail(order){
        navigate(`/owner/${restaurant.id}/order-detail/${order.id}`);
    }


    useEffect(()=>{
        window.scrollTo(0,0);
        // GET ACTIVE ORDERS LIST REQUEST
        (async ()=>{
            const [data, responseStatus] = await serverRequest(`/api/owner/orders/${restaurant.id}/active/`, "GET", true);

            if (responseStatus === 200){
                setOrders(data);
            }
            else if (responseStatus === 403){
                setNewNotification("You are not the Owner!");
            }
            else {
                console.log("Error: ", data);
                setNewNotification();
            }
        })();
    }, [])


    useEffect(()=>{
        if (restaurantWebSocket && restaurantWebSocket.status_icon === "cancel")
            setOrders(prev => prev ? prev.filter(order => order.id !== restaurantWebSocket.id) : null)
    }, [restaurantWebSocket])

    
    return (
        isProcessingOrders ?
            <Loading />
        :
            <>
                <h1 className="text-2xl font-bold mb-16">Active Orders - {orders ? orders.length : 0}</h1>

                <div className="flex justify-center flex-wrap gap-8">
                {
                    orders ?
                        orders.length ?
                            orders.map( order => (
                                <OrderCard key={order.id} order={order}
                                    handleViewDetail={handleViewDetail}
                                />
                            ))
                        :
                            <TextMessage message="No Active Order To Show!" />
                    :
                        <TextMessage message="Unable to load Orders!" />
                }
                </div>
            </>
    )
}