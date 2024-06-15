import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from "react-redux";

import { OrderCard, TextMessage, Loading } from "../../components";

import useServerRequest from "../../helper/useServerRequest";


export default function NewOrders(){

    const navigate = useNavigate();
    const restaurantWebSocket = useSelector(state => state.notification.restaurantWebSocket);
    const [restaurant, setRestaurant] = useOutletContext();

    const [isProcessingOrders, setNewNotification, serverRequest] = useServerRequest();
    const [orders, setOrders] = useState(null);


    function handleViewDetail(order){
        navigate(`/owner/${restaurant.id}/order-detail/${order.id}`);
    }

    async function getNewOrders(){
        const [data, responseStatus] = await serverRequest(`/api/owner/orders/${restaurant.id}/new/`, "GET", true);

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
    }

    useEffect(()=>{
        window.scrollTo(0,0);
        // GET NEW ORDERS LIST REQUEST
        getNewOrders();
    }, [])


    useEffect(()=>{
        if (restaurantWebSocket){
            if (restaurantWebSocket.status_icon === "cancel")
                setOrders(prev => prev ? prev.filter(order => order.id !== restaurantWebSocket.id) : null)
            else
                setOrders(prev => prev ? [restaurantWebSocket, ...prev] : [restaurantWebSocket])
        }
    }, [restaurantWebSocket])

    
    return (
        isProcessingOrders ?
            <Loading />
        :
            <>
                <h1 className="text-2xl font-bold mb-16">New Orders - {orders ? orders.length : 0}</h1>

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
                            <TextMessage message="No New Order To Show!" />
                    :
                        <TextMessage message="Unable to load Orders!" />
                }
                </div>
            </>
    )
}