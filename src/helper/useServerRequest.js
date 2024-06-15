import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { baseURL } from "../configrations/backendConfig";

import { addNotification } from "../reduxStore/notificationSlice";

export default function useServerRequest(){

    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);

    const [isProcessing, setIsProcessing] = useState(false);

    const headers = {
        "Content-Type":"application/json",
        "Accept": "application/json",
    }


    function setNewNotification(message="An error occured! Try again later.", status=false){
        dispatch(addNotification({message: message, success: status}));
    }


    async function serverRequest(urlPath, methodType, authenticated=false, fdata=null){
        setIsProcessing(true);

        const requestParams = {
            method: methodType,
            headers: authenticated ? {...headers, ["Authorization"] : `Bearer ${token}`} : headers,
        };

        if (fdata)
            requestParams["body"] = JSON.stringify(fdata);

        try{
            const response = await fetch(baseURL+urlPath, requestParams);

            if (methodType === "DELETE"){
                setIsProcessing(false);
                return response.status;
            }

            const data = await response.json();
            setIsProcessing(false);
            return [data, response.status];
        }
        catch (error){
            console.error("Server Error: ", error);
            setNewNotification("Unable to connect with Server!");
        }

        setIsProcessing(false);
    }

    
    return [isProcessing, setNewNotification, serverRequest];
}