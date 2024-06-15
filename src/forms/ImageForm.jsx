import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Form from "./Form";

import { FieldErrors, Modal } from "../components";

import { addNotification } from "../reduxStore/notificationSlice";

import changeImage from "../helper/changeImage";


export default function ImageForm({reference, setData, urlPath}) {

    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);

    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState(null);
    const [globalNotification, setGlobalNotification] = useState(null);
    
    function handleFileChange(e){
      setFile(e.target.files[0]);
    };

    function handleFormSubmit(event){
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('image', file);
        changeImage(token, formData, urlPath, setData, setIsProcessing, setFormErrors, setGlobalNotification);

    }


    useEffect(()=>{
        if (globalNotification)
            dispatch(addNotification(globalNotification));
    }, [globalNotification])


    return (
        <Modal reference={reference}>
            <Form handleFormSubmit={handleFormSubmit} formTitle="Upload Image" isProcessing={isProcessing} errors={formErrors} >
                <input type="file" name="image" onChange={handleFileChange} accept="image/*"/>
                
                <FieldErrors errors={formErrors?.image}/>
            </Form>
        </Modal>

    )
}