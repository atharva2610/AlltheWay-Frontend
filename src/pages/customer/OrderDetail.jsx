import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import RatingForm from "../../forms/RatingForm";

import { BillDetail, PrimaryButton, Icon, Loading, TextMessage, SecondaryButton, ConfirmBox } from "../../components";

import useServerRequest from "../../helper/useServerRequest";

export default function OrderDetail(){

    const navigate = useNavigate();
    const {order_id} = useParams();
    
    const customerWebSocket = useSelector(state => state.notification.customerWebSocket);
    const token = useSelector(state => state.auth.token);
    const confirmBoxReference = useRef(null);
    const ratingFormReference = useRef(null);
    
    const [isLoadingItems, setNewNotification, serverRequest] = useServerRequest();

    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);


    // OPEN CONFIRM BOX
    function handleOpenConfirmBox(){
        confirmBoxReference.current.classList.remove("hidden");
    }

    // OPEN RATING FORM
    function handleOpenRatingForm(){
        ratingFormReference.current.classList.remove("hidden");
    }

    // CANCEL ORDER REQUEST
    async function cancelOrder(){
        const [data, responseStatus] = await serverRequest(`/api/update-order-status/${order.id}/`, "PATCH", true, {status: "by_customer"});
        
        if (responseStatus === 200){
            setOrder(data);
            setNewNotification("Order Cancelled!", true);
        }
        else if (responseStatus === 403)
            setNewNotification("You cannot access this Order!");
        else if (responseStatus === 404)
            setNewNotification("Order Not Found!");
        else {
            console.log("Error: ",data);
            setNewNotification();
        }
    }

    // UPDATE ORDER ON RATING FORM SUCCESS SUBMISSION
    function handleRatingFormSuccess(order){
        setOrder(order);
    }

    function getDate(orderDate){
        const newDate = new Date(orderDate);
        return newDate.toLocaleString();
    }


    useEffect(()=>{
        if (!token)
            navigate("/");
        else{
            window.scrollTo(0,0);
            
            // GET ORDER & ORDER ITEMS REQUEST
            (async ()=>{
                const [data, responseStatus] = await serverRequest(`/api/order/${order_id}/`, "GET", true);
                
                if (responseStatus === 200){
                    setOrder(data.order);
                    setOrderItems(data.items);
                }
                else if (responseStatus === 403){
                    setNewNotification("You cannot access this Order!");
                }
                else if (responseStatus === 404){
                    setNewNotification("Order Not Found!");
                }
                else {
                    console.log("Error: ",data);
                    setNewNotification();
                }
            })();
        }
    }, [])


    useEffect(()=>{
        if (customerWebSocket)
            setOrder(customerWebSocket);
    }, [customerWebSocket])

    return (
        <>
            <RatingForm reference={ratingFormReference} orderId={order?.id} successHandler={handleRatingFormSuccess}/>

            <ConfirmBox reference={confirmBoxReference} message="Are sure to Cancel the Order?" handleConfirm={cancelOrder} />

            <section className="my-8">
            {
                isLoadingItems ?
                    <Loading />
                :
                    order ?
                        <div className="max-w-3xl w-full m-auto">
                            <div className="flex justify-end mb-8">
                                {order.status === "delivered" && !order.rated && <PrimaryButton iconName="kid_star" onClick={handleOpenRatingForm}>Rate Order</PrimaryButton>}
                                {order.status !== "delivered" && order.status_icon !== "cancel" && <SecondaryButton textColor="text-red-500" borderColor="border-red-500" iconName="cancel" onClick={handleOpenConfirmBox}>Cancel Order</SecondaryButton>}
                            </div>


                            <div className="mb-8">
                                <span className="text-zinc-500 text-sm font-bold">Ordered From</span>
                                <Link to={`/restaurant/${order.restaurant}`} className="flex items-center gap-2 text-lg md:text-xl font-bold capitalize">
                                    <Icon iconName="store" />
                                    {order.restaurant_name.toLowerCase()}
                                </Link>
                            </div>

                            <div className="mb-12">
                                <span className="text-zinc-500 text-sm font-bold">To</span>
                                <h2 className="flex items-center gap-2 text-lg md:text-xl font-bold"><Icon iconName="location_on" />{order.full_delivery_address}</h2>
                            </div>

                            <div className={`flex gap-2 mb-12 ${order.status_icon === "cancel" ? "text-red-500" : "text-emerald-500"} text-base font-bold`}>
                                <Icon iconName={order.status_icon}/>
                                <h3>{order.status_text}</h3>
                            </div>

                            <div className="mb-4">
                                <span className="text-zinc-500 text-sm font-bold">Order ID</span>
                                <h3 className="text-lg">{order.id}</h3>
                            </div>

                            <div className="mb-12">
                                <span className="text-zinc-500 text-sm font-bold">Order Date</span>
                                <h3 className="text-lg">{getDate(order.order_date)}</h3>
                            </div>

                            <h2 className="mb-4 text-base font-bold">Order Items</h2>
                            
                            {
                                orderItems ?
                                    <ul className="mb-12 border-dashed border-t-2 border-gray-300">
                                    {
                                        orderItems.map( item => (
                                            <li key={item.item_name} className="flex items-center justify-between mt-4">
                                                <span className="text-lg md:text-xl capitalize">{item.item_name.toLowerCase()} x {item.quantity}</span>
                                                <div className="flex items-center text-lg md:text-xl">
                                                    <Icon iconName="currency_rupee"/> {item.price}
                                                </div>
                                            </li>
                                        ))
                                    }
                                    </ul>
                                :
                                    <TextMessage message="Unable to load Items!" />
                            }
                            
                            <BillDetail itemTotal={order.item_amount} totalAmount={totalAmount} setTotalAmount={setTotalAmount}/>
                        </div>
                    :
                            <TextMessage message="Order Not Found!" />
            }
            </section>
        </>
    )
}