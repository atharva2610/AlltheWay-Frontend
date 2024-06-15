import { Link } from "react-router-dom";

import { SecondaryButton } from "./Button";
import Icon from "./Icon";


export default function OrderCard({order, showRestaurant=false, actionButtons=null, handleViewDetail}){

    function getDate(orderDate){
        const newDate = new Date(orderDate);
        return newDate.toLocaleString();
    }

    return (
        <div className="max-w-lg w-full p-6 md:p-12 border border-gray-300 rounded-[36px]">
            {
                showRestaurant && <Link to={`/restaurant/${order.restaurant}`} className="flex items-center gap-2 mb-8 text-lg md:text-xl font-bold capitalize">
                    <Icon iconName="store" />
                    {order.restaurant_name.toLowerCase()}
                </Link>
            }

            <div className={`flex gap-2 mb-8 ${order.status_icon === "cancel" ? "text-red-500" : "text-emerald-500"} text-base font-bold`}>
                <Icon iconName={order.status_icon}/>
                <h3>{order.status_text}</h3>
            </div>

            <div className="mb-4">
                <span className="text-zinc-500 text-sm font-bold">Order ID</span>
                <h3 className="text-lg md:text-lg">{order.id}</h3>
            </div>

            <div className="mb-4">
                <span className="text-zinc-500 text-sm font-bold">Order Date</span>
                <h3 className="text-lg md:text-lg">{getDate(order.order_date)}</h3>
            </div>

            <div className="mb-8">
                <span className="text-zinc-500 text-sm font-bold">Total Amount</span>
                <h3 className="flex items-center text-lg md:text-xl"><Icon iconName="currency_rupee" />{order.total_amount}</h3>
            </div>


            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4">
                {actionButtons}
                <SecondaryButton iconName="arrow_forward" onClick={()=>handleViewDetail(order)}>View Detail</SecondaryButton>
            </div>
        </div>
    )
}