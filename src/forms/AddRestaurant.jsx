import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Form from "./Form";
import { DeliveryLocationFields } from "./DeliveryLocationForm";
import hasEmptyValues from "./hasEmptyValues";

import { InputField, Modal } from "../components";

import useServerRequest from "../helper/useServerRequest";


export default function AddRestaurant({reference, setRestaurants}) {

    const token = useSelector(state => state.auth.token);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [formErrors, setFormErrors] = useState(null);


    function handleFormSubmit(event){
        event.preventDefault();

        setFormErrors(null);
        const fdata = new FormData(event.target);
        const temp = {};
        for (const [key, value] of fdata.entries())
            temp[key] = value;

        const [found, emptyFields] = hasEmptyValues(temp);

        if (!found){
            (async ()=>{
                const [data, responseStatus] = await serverRequest("/api/owner/add-restaurant/", "POST", true, temp);

                if (responseStatus === 201){
                    setRestaurants(prev => [...prev, data]);
                    setNewNotification("New Restaurant Added Successfully!", true);
                    event.target.reset();
                    reference.current.classList.add("hidden");
                }
                else if (responseStatus === 403){
                    setNewNotification("You cannot add more Restaurants!");
                }
                else if (responseStatus === 400){
                    setFormErrors(data);
                }
                else{
                    console.log("Error: ", data);
                    setNewNotification();
                }
            })();
        }
        else{
            setFormErrors(emptyFields);
        }
    }


    return (
        <Modal reference={reference} >
            <Form handleFormSubmit={handleFormSubmit} formTitle="Add Restaurant" isProcessing={isProcessing} errors={formErrors}>
            
                <InputField name="name" label="Restaurant Name" placeholder="Restaurant name" errors={formErrors?.name} />

                <InputField name="license" label="Licence No." placeholder="Licence No." errors={formErrors?.license} />

                <InputField type="number" name="phone" label="Contact Number" placeholder="Contact number" errors={formErrors?.phone} />

                <DeliveryLocationFields isRestaurant={true} errors={formErrors}/>
            </Form>
        </Modal>
     );
}