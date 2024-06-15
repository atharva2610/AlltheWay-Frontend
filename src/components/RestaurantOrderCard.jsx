import { SecondaryButton } from "./Button";
import Icon from "./Icon";

export default function RestaurantOrderCard({order, index, setViewOrder, handleOpenOrderDetailBox, cancelOrderStatus, statusIconWithMessage, orderTab="past"}) {
    
    return ( 
        <div className="p-4 border-dashed border-2 border-gray-300 rounded-md">
            
            <div className={`flex gap-2 ${(orderTab === "past" && cancelOrderStatus.includes(order.status)) ? "text-red-600" : "text-green-600"} text-base font-bold tracking-wider`}>
                <Icon iconName={statusIconWithMessage[order.status].iconName}/>
                <h3>{statusIconWithMessage[order.status].message}</h3>
            </div>

            <div className="my-4">
                <span className="text-zinc-500 text-sm tracking-wider font-bold">Order ID</span>
                <h2 className="text-xl tracking-wider">{order.id}</h2>
            </div>

            <div className="my-4">
                <span className="text-zinc-500 text-sm tracking-wider font-bold">Order Timing</span>
                <h3 className="text-lg">{order.order_date}</h3>
            </div>

            <div className="my-4">
                <span className="text-zinc-500 text-sm tracking-wider font-bold">Order Value</span>
                <h3 className="flex items-center text-lg font-bold"><Icon iconName="currency_rupee" />{order.item_amount}</h3>
            </div>

            <div className="flex flex-col mt-4 gap-2">
                <SecondaryButton textColor="text-black font-bold" border="border-transparent" hover="hover:text-orange-500" onClick={() => {
                        setViewOrder(index);
                        handleOpenOrderDetailBox();
                    }} >View Order</SecondaryButton>

                {
                    orderTab === "new" && <SecondaryButton textColor="text-orange-500" border="border-orange-500" extraCSS="flex justify-center items-center gap-1 font-bold">
                            <Icon iconName="done" />
                            Accept Order
                        </SecondaryButton>
                }

                {
                    orderTab === "active" && <SecondaryButton textColor="text-orange-500" border="border-orange-500" extraCSS="flex justify-center items-center gap-1 font-bold">
                            <Icon iconName="done" />
                            Order Prepared
                        </SecondaryButton>
                }

                {
                    orderTab !== "past" && <SecondaryButton extraCSS="flex justify-center items-center gap-1 font-bold">
                            <Icon iconName="close" />
                            Cancel Order
                        </SecondaryButton>
                }
            </div>
        </div>
     );
}