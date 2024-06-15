import { useState } from "react";

import { Icon, Modal } from "../components";

import Form from "./Form";

import useServerRequest from "../helper/useServerRequest";

export default function RatingForm({reference, orderId, successHandler}){

    const [rating, setRating] = useState(0);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    async function handleSubmit(event){
        event.preventDefault();

        const [data, responseStatus] = await serverRequest(`/api/rate-order/${orderId}/`, "POST", true, {rating: rating});

        if (responseStatus === 200){
            successHandler(data);
            setNewNotification("Thank you for rating!", true);
            reference.current.classList.add("hidden");
        }
        else if (responseStatus === 400){
            setNewNotification(data);
        }
        else if (responseStatus === 403){
            setNewNotification("You cannot access this Order!");
        }
        else if (responseStatus === 404){
            setNewNotification("Order Not Found!");
        }
        else{
            console.log("Error: ", data);
            setNewNotification();
        }
    }

    return (
        <Modal reference={reference}>
            <Form handleFormSubmit={handleSubmit} formTitle="Rate Restaurant" btnText="Submit" isProcessing={isProcessing}>
                <div className="flex justify-between mb-8">
                {
                    [1,2,3,4,5].map(val => (
                        <button key={val} type="button" className="grid grid-cols-1 gap-2" onClick={()=>setRating(val)}>
                            <Icon iconName="kid_star" className={`text-6xl ${val <= rating ? "text-yellow-500" : "text-zinc-500"}`}/>
                            <span>{val} Star</span>
                        </button>
                    ))
                }
                </div>
            </Form>
        </Modal>
    )
}