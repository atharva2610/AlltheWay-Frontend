import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Form from "./Form";
import hasEmptyValues from "./hasEmptyValues";

import { InputField } from "../components";

import { setToken, setUser } from "../reduxStore/userSlice";

 import useServerRequest from "../helper/useServerRequest";


export default function LoginForm() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [formErrors, setFormErrors] = useState(null);


    // handle Login form submit
    async function handleFormSubmit(event){
        event.preventDefault();

        setFormErrors(null);
        
        const fdata = new FormData(event.target);
        const temp = {};
        for (const [key, value] of fdata.entries())
            temp[key] = value;
        
        const [found, emptyFields] = hasEmptyValues(temp);

        if (!found){

            const [data, responseStatus] = await serverRequest("/api/account/login/", "POST", false, temp);

            if(responseStatus === 200){
                dispatch(setToken(data.authToken));
                dispatch(setUser(data.user));
                localStorage.setItem("FoodOrderingUserToken", data.authToken);
                setNewNotification("Login Successfull", true);
            }
            else if (responseStatus === 400 || responseStatus === 401){
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
        if (token){
            navigate("/");
        }
    })


    return ( 
        <section className="flex justify-center my-8">
            <Form handleFormSubmit={handleFormSubmit} formTitle="Sign To Order Your Favorite Food" iconName="login" btnText="Signin" isProcessing={isProcessing} errors={formErrors}>

                <InputField type="email" name="email" label="Email" placeholder="Enter your email" errors={formErrors?.email}/>

                <InputField type="password" name="password" label="Password" placeholder="Set password" errors={formErrors?.password}/>

                <Link to="/reset-password" className="text-base">Forget Password?</Link>

            </Form>
        </section>
     );
}