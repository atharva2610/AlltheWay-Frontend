import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { BillDetail, Icon, Loading, PrimaryButton, QuantityChangeButtons, TextMessage, VegTag } from "../../components";

import { setAmount, clearCart } from "../../reduxStore/cartSlice";
import useServerRequest from "../../helper/useServerRequest";


export default function Cart() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector(state => state.auth.token);
    const restaurantId = useSelector(state => state.cart.restaurantId);
    const restaurantName = useSelector(state => state.cart.restaurantName);
    const cart = useSelector(state => state.cart.cartItems);

    const [isProcessingItems, setNewNotification, serverRequest] = useServerRequest();

    const [itemsList, setItemsList] = useState(null);
    const [showableItems, setShowableItems] = useState(null);
    const [itemTotal, setItemTotal] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);


    function handleConfirmOrder(){
        dispatch(setAmount({item_amount: itemTotal, total_amount: totalAmount}));
        navigate("/confirm-order");
    }
    

    useEffect(()=>{
        window.scrollTo(0,0);
        if (restaurantId){
            // REQUEST TO GET ALL CART ITEMS
            (async ()=>{
                const items = Object.keys(cart);
                const [data, responseStatus] = await serverRequest(`/api/cart-items/${items}/`, "GET");
                
                if (responseStatus === 200){
                    setItemsList(data);
                }
                else if (responseStatus === 404){
                    setNewNotification("Item Not Found!");
                    dispatch(clearCart());

                }
                else{
                    console.log("Error: ", data);
                    setNewNotification();
                }
            })();
        }
    }, [restaurantId])


    useEffect(()=>{
        if (itemsList){
            let total = 0;
            const temp = [];
            for (const itemId in cart){
                const item = itemsList.find(item => item.id == itemId);
                total += item.price*cart[itemId];
                temp.push({...item});
            }
            setItemTotal(total);
            setShowableItems(temp);
        }
    }, [cart, itemsList])


    return ( 
        restaurantId ?
            <section className="my-8">
                <div className="max-w-3xl w-full m-auto">

                    <PrimaryButton onClick={token ? handleConfirmOrder : null} extraCSS="mb-8 ml-auto" iconName="done" bgColor="bg-emerald-500" textColor="text-white">{token ? "Confirm Order" : "Signin to Confirm Order"}</PrimaryButton>                            

                    {/* Restaurant name */}
                    <Link to={`/restaurant/${restaurantId}`} className="flex items-center gap-2 mb-12 text-xl font-bold capitalize">
                        <Icon iconName="store" />
                        {restaurantName.toLowerCase()}
                    </Link>

                    {
                        isProcessingItems ?
                            <Loading />
                        :
                            showableItems ?
                            <>
                                <h2 className="mb-4 text-lg md:text-xl font-bold">Order Items</h2>

                                <ul className="mb-12">
                                {
                                    showableItems.map( item => (
                                        <li key={item.id} >
                                            <div className="py-4 border-dashed border-t-2 border-gray-300">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <VegTag isVeg={item.is_veg}/>
                                                    <h2 className="text-xl capitalize">{item.name.toLowerCase()}</h2>
                                                </div>
                                                    
                                                <div className="flex items-center justify-between">
                                                    <h3 className="flex items-center text-xl">
                                                        <Icon iconName="currency_rupee"/>
                                                        {item.price}
                                                    </h3>

                                                    <QuantityChangeButtons selectedRestaurantId={restaurantId} itemId={item.id}/>
                                                </div>

                                            </div>

                                        </li>
                                    ))
                                }
                                </ul>

                                {/* Order Bill Details */}
                                <BillDetail itemTotal={itemTotal} totalAmount={totalAmount} setTotalAmount={setTotalAmount}/>
                            </>
                            :
                                <TextMessage message="Unable to load Cart! Try again Later." />
                    }
                </div>
            </section>
        :
            <div className="h-72 flex flex-col justify-center items-center gap-4">
                <TextMessage message="Your cart is empty!" />
            </div>
     );
}