import { useState } from "react";

import { IconButton } from "./Button";

import DeliveryLocationForm from "../forms/DeliveryLocationForm";


export default function DeliveryLocation({deliveryLocation, setDeliveryLocationList, handleOpenConfirmDelete}){

    const [showLocationForm, setShowLocationForm] = useState(false);

    return (
        <div className="p-4 mb-8 border border-gray-300 rounded-[36px]">
            {
                showLocationForm ?
                    <>
                        <IconButton onClick={()=>setShowLocationForm(false)} iconName="close" extraCSS="ml-auto mb-8"/>
                        <DeliveryLocationForm location={deliveryLocation.location} setDeliveryLocationList={setDeliveryLocationList}/>
                    </>
                :
                    <div key={deliveryLocation.id} className="flex items-center justify-between text-base">
                        {deliveryLocation.location.full_address}
                        
                        <div className="flex items-center">
                            <IconButton onClick={()=>setShowLocationForm(true)} iconName="edit" />
                            <IconButton iconName="delete" onClick={()=>handleOpenConfirmDelete(deliveryLocation.id)} />
                        </div>
                    </div>
            }
        </div>
    )
}