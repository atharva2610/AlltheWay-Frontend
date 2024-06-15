import { useState } from "react";
import { useSelector } from "react-redux";

import { Loading } from "../components";

import useServerRequest from "../helper/useServerRequest";


export default function ToggleButton({fieldName, restaurantId, setRestaurant, isDefaultChecked, checkedColor="bg-emerald-500", uncheckedColor="bg-red-500"}){

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [isChecked, setIsChecked] = useState(isDefaultChecked);
    const [errors, setErrors] = useState(null);

    async function handleToggle(){
        setIsChecked(prev => !prev);

        const fdata = {[fieldName] : !isChecked};

        const [data, responseStatus] =await serverRequest(`/api/owner/update-restaurant/${restaurantId}/`, "PATCH", true, fdata);

        if (responseStatus === 200){
            setRestaurant(data);
            setNewNotification("Restaurant Detail Updated!", true);
        }
        else if (responseStatus === 400){
            setErrors(data);
        }
        else if (responseStatus === 403){
            setNewNotification("You are not the Owner!");
        }
        else{
            console.log("Error: ", data);
            setNewNotification();
        }
    }


    return (
        isProcessing ?
            <Loading />
        :
            <div onClick={handleToggle} className={`cursor-pointer ${isChecked ? checkedColor : uncheckedColor} h-fit w-14 p-1 rounded-[36px]`}>
                <div className={`size-6 bg-white rounded-full transition ${isChecked ? "translate-x-full" : ""}`}></div>
            </div>
    )
}