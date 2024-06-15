import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Form from "./Form";
import hasEmptyValues from "./hasEmptyValues";

import { FieldErrors, InputField, Modal, VegTag } from "../components";

import useServerRequest from "../helper/useServerRequest";


export default function ItemForm({reference, item=null, setItems=null, setItem=null}) {

    const cuisines = useSelector(state => state.cityStateCuisine.cuisines);
    const {restaurant_id} = useParams();

    const [isProgressing, setNewNotification, serverRequest] = useServerRequest();

    const [formErrors, setFormErrors] = useState(null);
    const [isVeg, setIsVeg] = useState(false);
    const [defaultCuisine, setDefaultCuisine] = useState(cuisines[0].id);


    async function updateMenuItemRequest(fdata){
        const [data, responseStatus] = await serverRequest(`/api/owner/update-menu-item/${item.id}/`, "PATCH", true, fdata);

        if (responseStatus === 200){
            setItem(data);
            setNewNotification("Item Updated", true);
            reference.current.classList.add("hidden");
        }
        else if (responseStatus === 400){
            setErrors(data);
        }
        else if (responseStatus === 403){
            setNewNotification("You can not update this Item.");
        }
        else if (responseStatus === 404){
            setNewNotification("Item Not Found!");
        }
        else{
            console.log("Error: ", data);
            setNewNotification();
        }
    }


    async function addMenuItemRequest(fdata){
        const [data, responseStatus] = await serverRequest("/api/owner/add-menu-item/", "POST", true, fdata);

        if (responseStatus === 201){
            setItems(prev => prev ? [...prev, data] : [data]);
            setNewNotification("Item Added to Menu.", true);
            reference.current.classList.add("hidden");
        }
        else if (responseStatus === 400){
            setErrors(data);
        }
        else if (responseStatus === 403){
            setNewNotification("You can not update this Item.");
        }
        else{
            console.log("Error: ", data);
            setNewNotification();
        }
    }


    function handleFormSubmit(event){
        event.preventDefault();

        setFormErrors(null);
        const fdata = new FormData(event.target);
        let temp = {};
        for (const [key, value] of fdata.entries())
            temp[key] = value;

        const [found, emptyFields] = hasEmptyValues(temp, ["description"]);

        if (!found){
            if (item)
                updateMenuItemRequest(temp);
            else{
                temp["restaurant"] = restaurant_id;
                addMenuItemRequest(temp);
            }
        }
        else{
            setFormErrors(emptyFields);
        }
    }

    useEffect(()=>{
        setIsVeg(item ? item.is_veg : true);
        setDefaultCuisine(item ? item.cuisine : cuisines[0].id);
        setFormErrors(null);
    }, [item])


    return ( 
        <Modal reference={reference}>
            <Form handleFormSubmit={handleFormSubmit} formTitle="Menu Item Form" isProcessing={isProgressing} errors={formErrors}>
                <div className="flex gap-8">
                    <label htmlFor="veg" className="cursor-pointer flex gap-2 p-2 text-emerald-500 border border-transparent rounded-xl has-[:checked]:border-emerald-500">
                        <input className="appearance-none " type="radio" name="is_veg" id="veg" value={true} checked={isVeg} onChange={e=>setIsVeg(e.target.value==="true")}/>
                        <VegTag isVeg={true}/> VEG
                    </label>

                    <label htmlFor="non_veg" className="cursor-pointer flex gap-2 p-2 text-red-500 border border-transparent rounded-xl has-[:checked]:border-red-500">
                        <input className="appearance-none" type="radio" name="is_veg" id="non_veg" value={false} checked={!isVeg} onChange={e=>setIsVeg(e.target.value==="true")}/>
                        <VegTag isVeg={false}/> NON-VEG
                    </label>
                </div>

                <FieldErrors errors={formErrors?.is_veg} />

                <InputField name="name" label="Item name" placeholder="Item name" value={item?.name} errors={formErrors?.name}/>

                <InputField type="number" name="price" label="Price" placeholder="Price" value={item?.price} errors={formErrors?.price}/>

                <InputField label="Description" name="description" placeholder="Description" value={item?.description} optional={true} errors={formErrors?.description}/>


                <div className={`relative h-fit p-3 border ${formErrors?.cuisine ? "border-red-400" : "border-gray-300"} rounded-[36px]`}>
                    <label htmlFor="" className={`absolute top-0 left-0 translate-x-4 -translate-y-1/2 bg-white px-2 ${formErrors?.cuisine ? "text-red-500" : "text-zinc-500"} text-sm`} >Cuisine</label>
                    <select name="cuisine" className="cursor-pointer w-full outline-none text-base" value={defaultCuisine} onChange={e=>setDefaultCuisine(e.target.value)}>
                        {
                            cuisines.map(cuisine => (<option key={cuisine.id} value={cuisine.id}>{cuisine.name}</option>))
                        }
                    </select>
                </div>
                <FieldErrors errors={formErrors?.cuisine} />
            </Form>
        </Modal>
     );
}