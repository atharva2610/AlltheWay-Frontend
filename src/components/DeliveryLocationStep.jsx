import { useEffect } from "react";
import { useSelector } from 'react-redux';

import { PrimaryButton, SecondaryButton } from "../components/Button";
import TextMessage from "./TextMessage";
import Loading from "./Loading";

import useServerRequest from "../helper/useServerRequest";

export default function DeliveryLocationStep({setCurrentStep, deliveryLocationList, setDeliveryLocationList, handleOpenLocationForm, selectedLocationId, setSelectedLocationId}) {

    const restaurantId = useSelector(state => state.cart.restaurantId);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();


    useEffect(()=>{
        (async ()=>{
            const [data, responseStatus] = await serverRequest(`/api/account/matched-delivery-locations/${restaurantId}/`, "GET", true);

            if (responseStatus === 200){
                setDeliveryLocationList(data);
            }
            else{
                console.log("Error: ", data);
                setNewNotification();
            }
        })();
    }, [])


    return ( 
        <div>
                        
            {/* Title & add New location button */}
            <h2 className="mb-8 text-xl md:text-2xl font-bold">Select Deleivery Location</h2>

            {/* User Address */}
            {
                isProcessing ?
                    <Loading />
                :
                    deliveryLocationList ?
                        deliveryLocationList.length ?
                            deliveryLocationList.map(deliveryLocation => (
                                <div key={deliveryLocation.id} className="flex mb-4">
                                    <input className="peer appearance-none" type="radio" name="selectAddress" value={deliveryLocation.id} id={deliveryLocation.id} onChange={e => setSelectedLocationId(e.target.value)}/>
                                    <label htmlFor={deliveryLocation.id} className="cursor-pointer w-full p-4 text-lg md:text-xl border border-gray-300 rounded-[36px] peer-checked:border-emerald-500">{deliveryLocation.location.full_address}</label>
                                </div>
                            ))
                        :
                            <TextMessage message="No Delivery Location matches with Restaurant City!" />
                    :
                        <TextMessage message="Unable to load saved Locations! Try again later." />
            }  

            <div className="flex justify-between mt-8">
                <SecondaryButton iconName="add_location" onClick={handleOpenLocationForm}>New Location</SecondaryButton>

                {
                    selectedLocationId && <PrimaryButton iconName="done" bgColor="bg-emerald-500" textColor="text-white" onClick={()=>setCurrentStep(prev => prev += 1)}>Continue</PrimaryButton>
                }
            </div>

        </div>
     );
}