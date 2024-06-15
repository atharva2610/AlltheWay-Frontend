import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Form from "./Form";
import hasEmptyValues from "./hasEmptyValues";

import { FieldErrors, InputField } from "../components";

import { setCities, setStates } from "../reduxStore/cityStateCuisineSlice.js";

import useServerRequest from "../helper/useServerRequest.js";


export function DeliveryLocationFields({ location = null, isRestaurant=false, errors }) {

    const dispatch = useDispatch();
    const cities = useSelector(state => state.cityStateCuisine.cities);
    const states = useSelector(state => state.cityStateCuisine.states);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [belongCities, setBelongCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedState, setSelectedState] = useState("");


    function handleStateField(stateId) {
        const result = cities.filter(city => city.state.id == stateId);
        setSelectedState(stateId);
        setBelongCities(result);
        setSelectedCity(result[0].id);
    }


    useEffect(() => {

        if (!states.length) {
            (async () => {
                // GET ALL STATES IF NOT LOADED
                const [dataStates, responseStatusStates] = await serverRequest("/api/address/states/", "GET");
                
                if (responseStatusStates === 200) {
                    dispatch(setStates(dataStates));
                }
                else{
                    console.log("Error: ", dataStates);
                    setNewNotification();
                }

                // GET ALL CITIES IF NOT LOADED
                const [dataCities, responseStatusCities] = await serverRequest("/api/address/cities/", "GET");

                if (responseStatusCities === 200) {
                    dispatch(setCities(dataCities));
                }
                else{
                    console.log("Error: ", dataCities);
                    setNewNotification();
                }
            })();
        }
    }, [])


    useEffect(()=>{
        if (cities.length && states.length){
            if (location) {
                handleStateField(location.city.state.id);
                setSelectedCity(location.city.id);
            }
            else
                handleStateField(states[0].id);
        }
    }, [cities, states])


    if (!cities.length || !states.length)
        return <></>


    return (
        <>
            {/* House No. field */}
            <InputField name="house_no" label={isRestaurant ? "Shop No." : "House No."} placeholder={isRestaurant ? "Enter Shop No." : "Enter House No."} value={location?.house_no} errors={errors?.house_no} />

            {/* Street area field */}
            <InputField name="area" label="Street/Area" placeholder="Street/Area" value={location?.area} errors={errors?.area} />

            {/* Pin code field */}
            <InputField type="number" name="pincode" label="Pin code" value={location?.pincode} placeholder="Pin code" errors={errors?.pincode} />


            {/* Select field for State value */}
            <div className="relative h-fit p-3  border border-gray-300 rounded-[36px]">
                <label htmlFor="" className="absolute top-0 left-0 translate-x-4 -translate-y-1/2 bg-white px-2 text-zinc-500 text-sm">State</label>
                <select className="cursor-pointer w-full outline-none text-base" value={selectedState} onChange={event => handleStateField(event.target.value)}>
                    {
                        states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))
                    }
                </select>
            </div>


            {/* Select field for City value */}
            <div>
                <div className={`relative h-fit p-3 border ${errors?.city ? "border-red-400" : "border-gray-300"} rounded-[36px]`}>
                    <label htmlFor="" className={`absolute top-0 left-0 translate-x-4 -translate-y-1/2 bg-white px-2 ${errors?.city ? "text-red-500" : "text-zinc-500"} text-sm`} >City</label>
                    <select name="city" className="cursor-pointer w-full outline-none text-base" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                        {
                            belongCities.map(city => (<option key={city.id} value={city.id}>{city.name}</option>))
                        }
                    </select>
                </div>
                <FieldErrors errors={errors?.city} />
            </div>
        </>
    )
}


export default function DeliveryLocationForm({ location = null, setDeliveryLocationList }) {

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [formErrors, setFormErrors] = useState(null);


    function handleFormSubmit(event) {
        event.preventDefault();

        setFormErrors(null);
        let fdata = new FormData(event.target);
        const temp = {};
        for (const [key, value] of fdata.entries())
            temp[key] = value;

        const [found, emptyFields] = hasEmptyValues(temp);

        if (!found) {
            // UPDATE DELIVERY LOCATION
            async function updateLocationRequest(){
                const [data, responseStatus] = await serverRequest(`/api/address/update-location/${location.id}/`, "PUT", true, temp);

                if (responseStatus === 200){
                    setDeliveryLocationList(prev => prev.map(deliveryLocation => deliveryLocation.location.id === data.id ? {...deliveryLocation, ["location"]:data} : deliveryLocation));
                    setNewNotification("Location Updated!", true);
                    event.target.reset();
                    
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

            // ADD NEW DELIVERY LOCATION
            async function addDeliveryLocationRequest(){
                const [data, responseStatus] = await serverRequest("/api/account/add-delivery-location/", "POST", true, temp);
            
                if (responseStatus === 201){
                    setDeliveryLocationList(prev => prev ? [...prev, data]: [data]);
                    setNewNotification("New Location Added!", true);
                }
                else if (responseStatus === 400){
                    setErrors(data);
                }
                else if (responseStatus === 403){
                    setNewNotification("You can not add more Locations!");
                }
                else{
                    console.log("Error: ", data);
                    setNewNotification();
                }
            }

            
            if (location)
                updateLocationRequest();
            else
                addDeliveryLocationRequest();
        }
        else {
            setFormErrors(emptyFields);
        }
    }


    return (
        <Form handleFormSubmit={handleFormSubmit} btnText="Save Location" isProcessing={isProcessing} errors={formErrors}>
            <DeliveryLocationFields location={location} errors={formErrors} />
        </Form>
    )
}