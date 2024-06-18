import { useState } from "react";

import Icon from "./Icon";
import { IconButton, PrimaryButton, SecondaryButton } from "./Button";
import InputField from "./InputField";

import useServerRequest from "../helper/useServerRequest";


export default function InformationField({restaurantId, setRestaurant, icon, label, name, placeholder, info}){

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [allowEdit, setAllowEdit] = useState(false);
    const [formErrors, setFormErrors] = useState(null);

    
    async function handleFormSubmit(event){
        event.preventDefault();

        setFormErrors(null);
        const fdata = {};
        fdata[name] = event.target[name].value;

        if (fdata[name] === ""){
            setFormErrors({[name]: "This field is required!"});
        }
        else{
            const [data, responseStatus] = await serverRequest(`/api/owner/update-restaurant/${restaurantId}/`, "PATCH", true, fdata);

            if (responseStatus === 200){
                setRestaurant(data);
                setNewNotification("Restaurant Detail Updated!", true);
                setAllowEdit(false);
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
    }

    
    return (
        allowEdit ?
            <form onSubmit={handleFormSubmit} className="mb-16">
                <div className="flex justify-end gap-1 mb-8">
                    {
                        isProcessing ?
                            <Icon iconName="progress_activity" className="animate-spin"/>
                    :
                        <>
                            <PrimaryButton type="submit" iconName="done" extraCSS="hidden md:flex">Save</PrimaryButton>
                            <SecondaryButton iconName="close" onClick={()=>setAllowEdit(false)} extraCSS="hidden md:flex">Cancel</SecondaryButton>
                            <IconButton type="submit" iconName="done" bgColor="bg-yellow-500" textColor="text-black" extraCSS="md:hidden"/>
                            <IconButton iconName="close" onClick={()=>setAllowEdit(false)} extraCSS="md:hidden"/>
                        </>
                    }
                </div>
                <InputField label={label} name={name} value={info} placeholder={placeholder} errors={formErrors ? formErrors[name] : null}/>
            </form>
        :
            <div className="flex items-center gap-2 mb-8">
                <Icon iconName={icon}/>
                <h2 className="flex-1 text-lg">{info}</h2>
                <IconButton onClick={()=>setAllowEdit(true)} iconName="edit" />
            </div>
    )
}