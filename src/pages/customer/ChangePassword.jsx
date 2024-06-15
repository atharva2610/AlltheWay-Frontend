import {useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { InputField } from "../../components";

import Form from "../../forms/Form";

import hasEmptyValues from "../../forms/hasEmptyValues";

import useServerRequest from "../../helper/useServerRequest";


export default function ChangePassword({}) {

    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);

    const [isProgressing, setNewNotification, serverRequest] = useServerRequest();

    const [formErrors, setFormErrors] = useState(null);


    async function handleFormSubmit(event){
        event.preventDefault();

        setFormErrors(null);

        const fdata = {"old_password": event.target.old_password.value, "new_password":event.target.new_password.value};

        const [found, emptyFields] = hasEmptyValues(fdata);

        if (!found){
            const [data, responseStatus] = await serverRequest("/api/account/change-password/", "POST", true, fdata);
            
            if (responseStatus === 200){
                setNewNotification(data.message, true);
                event.target.reset();
            }
            else if (responseStatus === 400){
                setFormErrors(data);
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


    useEffect(()=>{
        if (!token)
            navigate("/");
        else
            window.scrollTo(0,0);
    }, [token])


    return ( 
        <section className="my-8">
            <Form handleFormSubmit={handleFormSubmit} formTitle="Change Password" isProcessing={isProgressing} errors={formErrors}>

                {/* Set new password field */}
                <InputField type="password" name="old_password" label="Old Password" placeholder="Confirm Old Password" errors={formErrors?.old_password}/>

                {/* Confirm new password field */}
                <InputField type="password" name="new_password" label="New Password" placeholder="Set New Password" errors={formErrors?.new_password}/>
            </Form>
        </section>

     );
}