import { useState } from "react";

import Form from "./Form";
import hasEmptyValues from "./hasEmptyValues";

import { InputField } from "../components";

import useServerRequest from "../helper/useServerRequest";


export default function RegistrationForm() {

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [formErrors, setFormErrors] = useState(null);

    
    async function handleFormSubmit(event){
        event.preventDefault();

        setFormErrors(null);

        const fdata = new FormData(event.target);
        const temp = {};
        for (const [key, value] of fdata.entries())
            temp[key] = value;

        const [found, emptyFields] = hasEmptyValues(temp);

        if (!found){
            const [data, responseStatus] = await serverRequest("/api/account/register/", "POST", false, temp);

            if(responseStatus === 201){
                setNewNotification("Account Created Successfully!", true);
                event.target.reset();
            }
            else if(responseStatus === 400){
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


    return ( 
        <section className="flex justify-center">
            <Form handleFormSubmit={handleFormSubmit} formTitle="Signup, your favorite Food is waiting" iconName="how_to_reg" btnText="Signup" isProcessing={isProcessing} errors={formErrors}>

                <InputField name="name" label="Name" placeholder="Enter your name" errors={formErrors?.name}/>

                <InputField type="email" name="email" label="Email" placeholder="Enter your email" errors={formErrors?.email}/>

                <InputField type="tel" name="phone" label="Phone No." placeholder="Enter phone no." errors={formErrors?.phone}/>

                <InputField type="password" name="password" label="Password" placeholder="Set password" errors={formErrors?.password}/>

                <InputField type="password" name="password2" label="Confirm Password" placeholder="Confirm password" errors={formErrors?.password2}/>

            </Form>
        </section>
     );
}