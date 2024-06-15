import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { IconButton } from "./Button";

import { addNotification, removeNotification } from "../reduxStore/notificationSlice";

export function useAddNewNotification(){
    const dispatch = useDispatch();

    function setNewNotification(message="An error occured! Try again later.", status=false){
        dispatch(addNotification({message: message, success: status}));
    }

    return setNewNotification;
}

export default function Notification() {

    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notification.notifications);


    function handleClose(index){
        dispatch(removeNotification(index));
    }

    return ( 
        <section className="z-40 fixed top-10 left-1/2 max-w-xl w-full px-2 -translate-x-1/2">
        {
            notifications.map((notification, index) => (
                <div key={index} className={`w-full flex justify-between items-center p-2 my-2 text-white ${notification.success ? "bg-emerald-500" : "bg-red-500"} rounded-md shadow-2xl`}>
                    <h2 className="text-base leading-none">{notification.message}</h2>
                    <IconButton onClick={()=>handleClose(index)} iconName="close" textColor="text-white" hover="" />
                </div>
            ))
        }
      </section>
     );
}