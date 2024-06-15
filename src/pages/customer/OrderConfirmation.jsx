import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { DeliveryLocationStep, Icon, Modal, PaymentStep, TextMessage } from "../../components";

import { clearCart } from "../../reduxStore/cartSlice";

import DeliveryLocationForm from "../../forms/DeliveryLocationForm";
import useServerRequest from "../../helper/useServerRequest";
import { rzId, rzSecretKey } from "../../configrations/backendConfig";


export default function OrderConfirmation(){

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const deliveryLocationFormReference = useRef(null);
    const orderConfirmationPageReference = useRef(null);
    const restaurantId = useSelector(state => state.cart.restaurantId);
    const cart = useSelector(state => state.cart.cartItems);
    const item_amount = useSelector(state => state.cart.item_amount);
    const total_amount = useSelector(state => state.cart.total_amount);

    const [_, setNewNotification, serverRequest] = useServerRequest();

    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null);
    const [serverResponse, setServerResponse] = useState(null);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [deliveryLocationList, setDeliveryLocationList] = useState(null);


    function handleOpenLocationForm(){
        deliveryLocationFormReference.current.classList.remove("hidden");
    }

    // CREATE ORDER REQUEST
    async function createOrder(orderPayment=null){
        orderConfirmationPageReference.current.classList.remove("hidden");
        let confirmed = false;
        const [data, responseStatus] = await serverRequest("/api/create-order/", "POST", true, {restaurant: restaurantId, cart: cart, delivery_location: selectedLocationId, payment_mode: paymentMode, item_amount:item_amount, total_amount:total_amount, payment_id: orderPayment ? orderPayment.id : ""});

        if (responseStatus === 201){
            setOrderConfirmed(true);
            setServerResponse("Congratulations! Order Placed.");
            confirmed = true;
        }
        else if(responseStatus === 400){
            setServerResponse("Failed To Confirm Order");
            console.log(data);
        }
        else{
            console.log("Error: ", data);
            setNewNotification();
        }

        if (confirmed){
            setTimeout(()=>{
                orderConfirmationPageReference.current.classList.add("hidden");
                dispatch(clearCart());
                setOrderConfirmed(false);
                navigate("/orders");
                setNewNotification("Congratulations! Order Placed.", true);
            }, 3000)
        }
        else{
            setTimeout(()=>{
                orderConfirmationPageReference.current.classList.add("hidden");
                setNewNotification("Failed to Confirm Order!", false);
            }, 3000)
        }
    }

    // HANDLE RAZORPAY SUCCESS REQUEST
    async function handlePaymentSuccess(response){
        const [data, responseStatus] = await serverRequest("/api/payment/success/", "POST", true, response);

        if (responseStatus === 200){
            createOrder(data);
            setNewNotification("Payment Received!", true);
            return;
        }
        else if (responseStatus === 404){
            setNewNotification("Payment Not Found!");
        }
        else{
            setNewNotification();
        }
    }

    // OPEN RAZORPAY PAYMENT UI
    async function openRazorPay(){
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
    }


    // HANDLE CONFIRM ORDER CLICK
    async function handleConfirmOrder(){
        if (paymentMode === "online"){
            (async ()=>{
                const response = await openRazorPay();

                const [data, responseStatus] = await serverRequest("/api/pay/", "POST", true, {amount: total_amount});

                if (responseStatus === 200){
                    let options = {
                        key_id: rzId, 
                        key_secret: rzSecretKey,
                        amount: data.payment.amount,
                        currency: "INR",
                        name: "All The Way",
                        order_id: data.payment.id,
                        handler: function (response) {
                            console.log("payment success!");
                            handlePaymentSuccess(response);
                        },
                        theme: {
                            color: "#3399cc",
                        },
                    };
                    
                    let rzp1 = new window.Razorpay(options);
                    rzp1.open();
                }
            })();
        }
        else{
            createOrder();
        }
    }


    useEffect(()=>{
        if (!restaurantId){
            navigate(-1);
        }
        else
            window.scrollTo(0,0);
    }, [])

    const steps = [
        {
            stepIcon: "location_on",
            stepName: "Delivery",
            content: <DeliveryLocationStep setCurrentStep={setCurrentStep} deliveryLocationList={deliveryLocationList} setDeliveryLocationList={setDeliveryLocationList} handleOpenLocationForm={handleOpenLocationForm} selectedLocationId={selectedLocationId} setSelectedLocationId={setSelectedLocationId}/>
        },
        {
            stepIcon: "account_balance_wallet",
            stepName: "Payment",
            content: <PaymentStep setCurrentStep={setCurrentStep} handleConfirmOrder={handleConfirmOrder} paymentMode={paymentMode} setPaymentMode={setPaymentMode} setSelectedLocationId={setSelectedLocationId}/>
        }];


    return (
        restaurantId ?
        <>
            {/* Location Form */}
            <Modal reference={deliveryLocationFormReference}>
                <DeliveryLocationForm setDeliveryLocationList={setDeliveryLocationList}/>
            </Modal>


            {/* Order Confirmation Page */}
            <section ref={orderConfirmationPageReference} className="hidden z-30 fixed top-0 left-0 right-0 bottom-0 bg-white flex justify-center items-center">
                <div className="bg-white flex flex-col items-center gap-8">
                    {
                        serverResponse ?
                        <>
                            <Icon iconName={orderConfirmed ? "check_circle" : "cancel"} className={`${orderConfirmed ? "text-emerald-500" : "text-red-500"} text-8xl rounded-[50%]`}/>
                            <h3 className="text-2xl font-bold">{serverResponse}</h3>
                        </>
                        :
                            <Icon iconName="progress_activity" className="animate-spin text-8xl"/>  
                    }
                </div>
            </section>


            {/* Delivery Location & Payment */}
            <section className="max-w-xl m-auto my-8">

                {/* Order steps */}
                <div className="relative max-w-lg flex justify-between items-center m-auto after:content-[''] after:absolute after:-z-10 after:top-1/2 after:left-0 after:w-full after:border-dashed after:border-b-2 after:border-black">
                    {
                        steps.map( (step, index) => (
                            <div key={index} className={`bg-white flex flex-col items-center gap-3 px-4 ${index <= currentStep ? "" : ""}`}>
                                <Icon iconName={step.stepIcon} className={`p-3 border-2 rounded-[50%] ${index <= currentStep ? "bg-black border-black text-white" : "border-gray-300"}`}/>
                                <span className="text-sm font-bold tracking-widest">{step.stepName}</span>
                            </div>
                            )
                        )
                    }
                </div>

                {/* Steps Form */}
                <div className="my-16">
                    {steps[currentStep].content}
                </div>

            </section>
        </>
        :
            <div className="h-96 flex flex-col justify-center items-center gap-4">
                <Icon iconName="production_quantity_limits" className="text-8xl" />
                <TextMessage message="Your cart is Empty!" />
            </div>
    )
}