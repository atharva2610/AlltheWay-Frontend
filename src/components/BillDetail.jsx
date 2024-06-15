import { useEffect, useState } from "react";
import Icon from "../components/Icon";

export default function BillDetail({itemTotal=0, totalAmount, setTotalAmount}) {

    const platformFee = 5;
    const deliveryFee = 30;
    const [GST, setGST] = useState(0);

    useEffect(()=>{
        const gst = Math.ceil(itemTotal*0.05);
        setGST(gst);
        setTotalAmount(itemTotal+platformFee+deliveryFee+gst);
    }, [itemTotal])

    return ( 
        <div className="">
            <h2 className="mb-4 text-base font-bold">Bill Details</h2>

            <ul className="py-4 mb-4 border-dashed border-y-2 border-gray-300">
                <li className="flex items-center justify-between text-lg md:text-xl">
                    <span>Item Total</span>
                    <span className="flex items-center"><Icon iconName="currency_rupee" />{itemTotal}</span>
                </li>

                <li className="flex items-center justify-between mt-4 text-lg md:text-xl">
                    <span>Delivery Fee</span>
                    <span className="flex items-center"><Icon iconName="currency_rupee" />{deliveryFee}</span>
                </li>

                <li className="flex items-center justify-between mt-4 text-lg md:text-xl">
                    <span>Platform Fee</span>
                    <span className="flex items-center"><Icon iconName="currency_rupee" />{platformFee}</span>
                </li>

                <li className="flex items-center justify-between mt-4 text-lg md:text-xl">
                    <span>Taxes</span>
                    <span className="flex items-center"><Icon iconName="currency_rupee" />{GST}</span>
                </li>

            </ul>

            <div className="flex items-center justify-between text-lg md:text-xl font-bold">
                Total Amount
                <span className="flex items-center font-bold"><Icon iconName="currency_rupee" />{totalAmount}</span>
            </div>
        </div>
     );
}