import { useState } from "react";

import { Modal } from "../components";

import Form from "./Form";
import { DeliveryLocationFields } from "./DeliveryLocationForm";
import hasEmptyValues from "./hasEmptyValues";

import useServerRequest from "../helper/useServerRequest";

export default function LocationForm({reference, setRestaurant=null, location=null}) {

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [formErrors, setFormErrors] = useState(null);


    async function handleFormSubmit(event){
        event.preventDefault();

        setFormErrors(null);
        let fdata = new FormData(event.target);
        const temp = {};
        for (const [key, value] of fdata.entries())
            temp[key] = value;

        const [found, emptyFields] = hasEmptyValues(temp);

        if (!found){
            const [data, responseStatus] = await serverRequest(`/api/address/update-location/${location.id}/`, "PUT", true, temp);

            if (responseStatus === 200){
                setRestaurant(prev => ({...prev, ["location"]:data}));
                setNewNotification("Location Updated!", true);
                reference.current.classList.add("hidden");
            }
            else if (responseStatus === 400){
                setFormErrors(data);
            }
            else if (responseStatus === 403){
                setNewNotification("You can not update this Location!");
            }
            else{
                console.log("Error: ", data);
                setNewNotification();
            }
        }
        else{
            setFormErrors(emptyFields);
        }
    }


    return (
        <Modal reference={reference}>
            <Form handleFormSubmit={handleFormSubmit} formTitle={"Location Form"} isProcessing={isProcessing} errors={formErrors}>
                <DeliveryLocationFields location={location} errors={formErrors} isRestaurant={true}/>
            </Form>
        </Modal>
    );
}