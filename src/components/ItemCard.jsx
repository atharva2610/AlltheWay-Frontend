import { SecondaryButton } from "./Button";
import Icon from "./Icon";
import VegTag from "./VegTag";

import { baseURL } from "../configrations/backendConfig";

export default function ItemCard({item, restaurantInfo=<></>, handleViewDetail, quantityChangeButtons=<></>}) {

    
    return (
        <div className="w-80 h-fit p-6 border border-gray-300 rounded-[36px]">
            {restaurantInfo}
            
            <img  className="bg-gray-200 size-32 m-auto object-cover mb-8 rounded-2xl" src={`${baseURL}${item.image}`} alt="" />

            <div className="flex gap-2 mb-4">
                <VegTag isVeg={item.is_veg}/>
                <h2 className="text-xl capitalize">{item.name.toLowerCase()}</h2>
            </div>
            
            <div className="flex items-center justify-between mb-4">
                <span className="flex items-center text-xl">
                    <Icon iconName="currency_rupee"/>
                    {item.price}
                </span>

                <SecondaryButton onClick={handleViewDetail}>View Detail</SecondaryButton>
            </div>

            {quantityChangeButtons}
        </div>
    )
}