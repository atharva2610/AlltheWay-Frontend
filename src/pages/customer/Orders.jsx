import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { PrimaryButton, Loading, OrderCard, TextMessage, SecondaryButton, ConfirmBox } from "../../components";

import RatingForm from "../../forms/RatingForm";

import useServerRequest from "../../helper/useServerRequest";


export default function Orders() {

    const navigate = useNavigate();
    const customerWebSocket = useSelector(state => state.notification.customerWebSocket);
    const token = useSelector(state => state.auth.token);
    const confirmBoxReference = useRef(null);
    const ratingFormReference = useRef(null);

    const [isLoadingOrders, setNewNotification, serverRequest] = useServerRequest();

    const [activeOrders, setActiveOrders] = useState([]);
    const [pastOrders, setPastOrders] = useState(null);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [orderToRate, setOrderToRate] = useState(null);


    // NAVIGATE TO ORDER DETAILS PAGE ON CLICK
    function handleViewDetail(orderId){
        navigate(`${orderId}`);
    }

    // RATE ORDER
    function handleOpenRatingForm(){
        ratingFormReference.current.classList.remove("hidden");
    }

    // OPEN CONFIRM BOX
    function handleOpenConfirmBox(){
        confirmBoxReference.current.classList.remove("hidden");
    }

    // CANCEL ORDER REQUEST
    async function cancelOrder(){
        const [data, responseStatus] = await serverRequest(`/api/update-order-status/${orderToCancel}/`, "PATCH", true, {status: "by_customer"});
        
        if (responseStatus === 200){
            setPastOrders(prev => prev.map(order => (order.id === data.id ? data : order)));
            setNewNotification("Order Cancelled", true);
        }
        else if (responseStatus === 403)
            setNewNotification("You cannot cancel Order");
        else if (responseStatus === 404)
            setNewNotification("Order Not Found!");
        else {
            console.log("Error: ",data);
            setNewNotification();
        }

        setOrderToCancel(null);
    }

    // UPDATE  ORDER ON RATING FORM SUCCESS SUBMISSION
    function handleRatingFormSuccess(updatedOrder){
        setPastOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order));
        setOrderToRate(null);
    }


    useEffect(()=>{
        if (!token)
            navigate("/");
        else{
            window.scrollTo(0,0);
            
            // REQUEST TO GET ORDERS LIST
            (async ()=>{
                const [data, responseStatus] = await serverRequest("/api/orders/", "GET", true);
                
                if (responseStatus === 200){
                    const tempActiveOrders = [];
                    const tempPastOrders = [];
                    data.forEach(order => {
                        if (order.status === "delivered" || order.status_icon === "cancel")
                            tempPastOrders.push(order);
                        else
                            tempActiveOrders.push(order);
                    })
                    setActiveOrders(tempActiveOrders);
                    setPastOrders(tempPastOrders);
                }
                else {
                    console.log("Error: ",data);
                    setNewNotification();
                }
            })();
        }
    }, [token])


    useEffect(()=>{
        if (customerWebSocket){
            if (customerWebSocket.status === "delivered" || customerWebSocket.status_icon === "cancel")
                setPastOrders(prev => prev ? prev.map(order => order.id === customerWebSocket.id ? customerWebSocket : order): [customerWebSocket]);
            else
                setActiveOrders(prev => prev ? prev.map(order => order.id === customerWebSocket.id ? customerWebSocket : order): [customerWebSocket]);
        }

    }, [customerWebSocket])


    return ( 
        <>
            <RatingForm reference={ratingFormReference} orderId={orderToRate?.id} successHandler={handleRatingFormSuccess}/>

            <ConfirmBox reference={confirmBoxReference} message="Are sure to Cancel the Order?" handleConfirm={cancelOrder} />

            <section className="my-8">
                {
                    isLoadingOrders ?
                        <Loading />
                    :
                        <>
                            {/* ACTIVE ORDERS */}
                            {
                                activeOrders.length ?
                                    <>
                                        <h1 className="text-2xl font-bold mb-16">Active Orders - {activeOrders.length}</h1>

                                        <div className="flex justify-center flex-wrap gap-8 mb-32">
                                        {
                                            activeOrders.map( order => (
                                                <OrderCard key={order.id} order={order} showRestaurant={true}
                                                    actionButtons={
                                                        <SecondaryButton textColor="text-red-500" borderColor="border-red-500" iconName="cancel" onClick={()=>{
                                                            setOrderToCancel(order.id);
                                                            handleOpenConfirmBox();
                                                        }}>Cancel Order</SecondaryButton>
                                                    }

                                                    handleViewDetail={()=>handleViewDetail(order.id)}
                                                />)
                                            )
                                        }
                                        </div>
                                    </>
                                :
                                    <></>
                            }

                            {/* PAST ORDERS */}
                            {
                                pastOrders ?
                                    pastOrders.length ?
                                        <>
                                            <h1 className="text-2xl font-bold my-16">Past Orders - {pastOrders.length}</h1>

                                            <div className="flex justify-center flex-wrap gap-8">
                                            {
                                                pastOrders.map( order => (
                                                    <OrderCard key={order.id} order={order} showRestaurant={true}
                                                        actionButtons={
                                                            <>
                                                                {order.status === "delivered" && !order.rated && <PrimaryButton iconName="kid_star" onClick={()=>{
                                                                    setOrderToRate(order);
                                                                    handleOpenRatingForm();
                                                                }}>Rate Order</PrimaryButton>}
                                                            </>
                                                        }

                                                        handleViewDetail={()=>handleViewDetail(order.id)}
                                                    />)
                                                )
                                            }
                                            </div>
                                        </>
                                    :
                                        <TextMessage message="No Past Orders to show!" />
                                :
                                    <TextMessage message="Unable to load Orders!" />
                            }
                        </>
                    
            }
            </section>
        </>
     );
}