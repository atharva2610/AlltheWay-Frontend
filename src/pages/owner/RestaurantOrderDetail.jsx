import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { PrimaryButton, IconButton, Icon, Loading, TextMessage, SecondaryButton, ConfirmBox, Modal } from "../../components";

import useServerRequest from "../../helper/useServerRequest";


export default function RestaurantOrderDetail(){

    const navigate = useNavigate();
    const {restaurant_order_id} = useParams();
    const restaurantWebSocket = useSelector(state => state.notification.restaurantWebSocket);
    const token = useSelector(state => state.auth.token);
    const confirmBoxReference = useRef(null);
    const modalReference = useRef(null);
    
    const [isLoadingItems, setNewNotification, serverRequest] = useServerRequest();

    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState(null);
    const [confirmBoxMessage, setConfirmBoxMessage] = useState("");
    const [orderStatus, setOrderStatus] = useState(null);
    const [updateStatusSuccessMessage, setUpdateStatusSuccessMessage] = useState("Order status updated!");

    const cancelReasons = [
        {status: "restaurant_rejected", text: "Cannot accept Order at this moment."},
        {status: "out_of_stock", text: "Required materials are out of stock."},
        {status: "accident", text: "Due to unfortunate accident unable to deliver."}
    ];


    // OPEN CONFIRM BOX
    function handleOpenConfirmBox(){
        confirmBoxReference.current.classList.remove("hidden");
    }

    function getDate(orderDate){
        const newDate = new Date(orderDate);
        return newDate.toLocaleString();
    }

     // OPEN ORDER CANCEL REASON MODAL
     function handleOpenModal(){
        modalReference.current.classList.remove("hidden");
    }

    // UPDATE ORDER STATUS REQUEST
    async function updateOrderStatus(){
        const [data, responseStatus] = await serverRequest(`/api/owner/update-order-status/${order.id}/`, "PATCH", true, {status: orderStatus});
        
        if (responseStatus === 200){
            setOrder(data);
            setNewNotification(updateStatusSuccessMessage, true);
        }
        else if (responseStatus === 403)
            setNewNotification("You cannot access this Order!");
        else if (responseStatus === 404)
            setNewNotification("Order Not Found!");
        else {
            console.log("Error: ", data);
            setNewNotification();
        }
    }


    useEffect(()=>{
        if (!token)
            navigate("/");
        else{
            window.scrollTo(0,0);
            // GET ORDER REQUEST
            (async ()=>{
                const [data, responseStatus] = await serverRequest(`/api/owner/order/${restaurant_order_id}/`, "GET", true);
                
                if (responseStatus === 200){
                    setOrderItems(data.items);
                    setOrder(data.order);
                }
                else if (responseStatus === 403){
                    setNewNotification("This is not Your Order!");
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
        if (restaurantWebSocket)
            setOrder(restaurantWebSocket);
    }, [restaurantWebSocket])


    return (
        <>
            <ConfirmBox reference={confirmBoxReference} message={confirmBoxMessage} handleConfirm={updateOrderStatus} confirmBtnColor="bg-emerald-500"/>
            
            {/* MODAL FORM CANCEL ORDER REASON */}
            <Modal reference={modalReference}>

                <h1 className="text-xl font-bold mb-8 capitalize">Select Cancellation Reason</h1>

                <form onSubmit={(event)=>{
                    event.preventDefault();
                    if(event.target.order_status.value){
                        setUpdateStatusSuccessMessage("Order has been Cancelled!");
                        updateOrderStatus();
                    }
                }} className="flex flex-col gap-4 mb-8">
                    {
                        cancelReasons.map(
                            reason => (
                                <label key={reason.status} htmlFor={reason.status} className="cursor-pointer has-[:checked]:border-red-500  p-4 border border-gray-300 rounded-[36px]">
                                    <input className="appearance-none" type="radio" name="order_status" id={reason.status} value={reason.status} onChange={()=>setOrderStatus(reason.status)}/>
                                    <span className="text-lg">{reason.text}</span>
                                </label>
                            )
                        )
                    }

                    <PrimaryButton type="submit" bgColor="bg-red-500" textColor="text-white" iconName="cancel" extraCSS="ml-auto">Cancel Order</PrimaryButton>
                </form>
            </Modal>

            <section className="my-8">
            {
                isLoadingItems ?
                    <Loading />
                :
                    order ?
                        <div className="max-w-3xl w-full m-auto">

                            <IconButton iconName="arrow_back" extraCSS="mb-4" onClick={()=>navigate(-1)} />


                            <div className="flex justify-end gap-4 mb-8">
                                {/* ACCEPT ORDER BUTTON */}
                                {order.status === "ordered" && <PrimaryButton bgColor="bg-emerald-500" textColor="text-white" iconName="done" onClick={()=>{
                                    setOrderStatus("preparing");
                                    setConfirmBoxMessage("Confirm to accept the Order.");
                                    setUpdateStatusSuccessMessage("Order has been Accepted!");
                                    handleOpenConfirmBox();
                                }}>Accept Order</PrimaryButton>}

                                {/* ORDER READY BUTTON */}
                                {order.status === "preparing" && <PrimaryButton bgColor="bg-emerald-500" textColor="text-white" iconName="done" onClick={()=>{
                                    setOrderStatus("prepared");
                                    setConfirmBoxMessage("Mark Order status, ready for delivery?");
                                    setUpdateStatusSuccessMessage("Order status updated to Ready!");
                                    handleOpenConfirmBox();
                                }}>Order Ready</PrimaryButton>}

                                {/* ORDER DELIVERING BUTTON */}
                                {order.status === "prepared" && <PrimaryButton bgColor="bg-emerald-500" textColor="text-white" iconName="done" onClick={()=>{
                                    setOrderStatus("delivering");
                                    setConfirmBoxMessage("Mark Order status, Out for Delivery?");
                                    setUpdateStatusSuccessMessage("Order is Out for Delivery!");
                                    handleOpenConfirmBox();
                                }}>Delivering</PrimaryButton>}

                                {/* ORDER DELIVERED BUTTON */}
                                {order.status === "delivering" && <PrimaryButton bgColor="bg-emerald-500" textColor="text-white" iconName="done" onClick={()=>{
                                    setOrderStatus("delivered");
                                    setConfirmBoxMessage("Order has been delivered to the Customer?");
                                    setUpdateStatusSuccessMessage("Order has been Delivered!");
                                    handleOpenConfirmBox();
                                }}>Delivered</PrimaryButton>}

                                {/* CANCEL ORDER BUTTON */}
                                {order.status !== "delivered" && order.status_icon !== "cancel" && <SecondaryButton textColor="text-red-500" borderColor="border-red-500" iconName="cancel" onClick={handleOpenModal}>Cancel Order</SecondaryButton>}
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
                                <h3 className="text-lg md:text-xl">{order.id}</h3>
                            </div>

                            <div className="mb-12">
                                <span className="text-zinc-500 text-sm font-bold">Order Date</span>
                                <h3 className="text-lg md:text-xl">{getDate(order.order_date)}</h3>
                            </div>

                            <h2 className="mb-4 text-lg md:text-xl font-bold">Order Items</h2>
                            
                            <ul className="pb-4 mb-4 border-dashed border-y-2 border-gray-300">
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

                            <div className="flex justify-between mb-16 text-xl font-bold">
                                Total Amount
                                <strong className="flex items-center">
                                    <Icon iconName="currency_rupee" />
                                    {order.item_amount}
                                </strong>
                            </div>
                        </div>
                    :
                            <TextMessage message="Order Not Found!" />
                            
            }
            </section>
        </>
    )
}