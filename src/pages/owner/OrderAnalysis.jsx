import { Link, useOutletContext } from "react-router-dom";
import { Icon, Loading, TextMessage } from "../../components";
import useServerRequest from "../../helper/useServerRequest";
import { useEffect, useState } from "react";

export default function OrderAnalysis(){

    const [restaurant, setRestaurant] = useOutletContext();
    const [items, setItems] = useState(null);
    const [info, setInfo] = useState(null);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    useEffect(()=>{
        (async ()=>{
            const [data, responseStatus] = await serverRequest(`/api/owner/order-summary/${restaurant.id}/`, "GET", true);

            if (responseStatus === 200){
                setInfo(data.info);
                setItems(data.items);
            }
            else if (responseStatus === 403){
                setNewNotification("You are not the Restaurant!");
            }
            else if (responseStatus === 404){
                setNewNotification("Restaurant Not Found!");
            }
            else{
                setNewNotification();
            }
        })();
    }, [])

    return (
        <div className="max-w-screen">
            <h1 className="mb-16 text-xl md:text-2xl font-bold capitalize">Order Summary - {restaurant.name.toLowerCase()}</h1>
        
            {
                isProcessing ?
                    <Loading />
                :
                    items ?
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 place-items-center gap-x-4 gap-y-16 md:gap-16 mb-32">
                                <div>
                                    <h3 className="flex items-center gap-2 mb-2 text-lg">
                                        <Icon iconName="currency_rupee" />
                                        Total Revenue</h3>
                                    <strong className="text-4xl">{info.total_revenue}</strong>
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 mb-2 text-lg"><Icon iconName="orders" />Total Orders</h3>
                                    <strong className="text-4xl">{info.total_orders}</strong>
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 mb-2 text-lg"><Icon iconName="check_circle" className="text-emerald-500"/>Delivered</h3>
                                        <strong className="text-4xl">{info.delivered_orders}</strong>
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 mb-2 text-lg"><Icon iconName="skillet" className="text-orange-500"/>Active Orders</h3>
                                    <strong className="text-4xl">{info.active_orders}</strong>
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 mb-2 text-lg"><Icon iconName="cancel" className="text-red-500" />Cancelled</h3>
                                    <strong className="text-4xl">{info.cancelled_orders}</strong>
                                </div>
                            </div>

                            <h1 className="mb-8 text-xl font-bold text-center">Most Ordered Items</h1>

                            <ul className="max-w-screen md:max-w-5xl px-8 py-4 m-auto text-lg border border-gray-300 rounded-[36px] divide-dashed divide-y-2 divide-gray-300">
                                <li className="flex py-4">
                                    <strong className="flex-1">Items - {items.length}</strong>
                                    <strong>No. Of Orders</strong>
                                </li>

                                {
                                    items.map( item => (
                                        <li key={item.id} className="flex gap-4 py-4">
                                            <h2 className="flex-1 capitalize truncate">{item.name.toLowerCase()}</h2>
                                            <span className="shrink-0">{item.order_frequency} orders</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                    :
                        <TextMessage message="Unable to load data!" />
            }
        </div>
    )
}