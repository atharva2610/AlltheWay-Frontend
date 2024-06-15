import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { PrimaryButton, DeliveryLocation, Icon, InputField, Loading, FormErrorMessage, TextMessage, SecondaryButton, Modal, ConfirmBox } from "../../components";

import DeliveryLocationForm from "../../forms/DeliveryLocationForm";
import hasEmptyValues from "../../forms/hasEmptyValues";

import { setUser, setToken } from "../../reduxStore/userSlice";
import { setFavorites } from "../../reduxStore/favoriteRestaurantsSlice";
import { setSelectedCity } from "../../reduxStore/userSelectedCitySlice";
import { clearCart } from "../../reduxStore/cartSlice";

import useServerRequest from "../../helper/useServerRequest";


export default function Account() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);
    const user = useSelector(state => state.auth.user);
    
    const confirmBoxReference = useRef(null);
    const locationFormReference = useRef(null);
    const accountFormReference = useRef(null);

    const [isProgressingUser, setNewNotification, serverRequestUser] = useServerRequest();
    const [isProcessingDeliveryLocations, _,  serverRequestLocations] = useServerRequest();

    const [formErrors, setFormErrors] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [deliveryLocationList, setDeliveryLocationList] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");



    function handleOpenLocationForm(){
        locationFormReference.current.classList.remove("hidden");
    }


    function handleOpenConfirmDeleteForLocation(locationId){
        setConfirmMessage("Delivery Location will be deleted permanently!");
        setToDelete(locationId);
        confirmBoxReference.current.classList.remove("hidden");
    }

    function handleOpenConfirmDeleteForAccount(locationId){
        setConfirmMessage("Are you sure to delete account permanently?");
        setToDelete(locationId);
        confirmBoxReference.current.classList.remove("hidden");
    }

    function handleLogout(){
        localStorage.clear();
        dispatch(clearCart());
        dispatch(setFavorites([]));
        dispatch(setSelectedCity(null));
        dispatch(setUser(null));
        dispatch(setToken(null));
    }


    async function handleDeleteDelivaryLocation(){
        const responseStatus = await serverRequestLocations(`/api/account/delivery-location/${toDelete}/`, "DELETE", true);
        
        if (responseStatus === 204){
            setDeliveryLocationList(prev => prev.filter(location => location.id !== toDelete ));
            setNewNotification("Delivery Location Deleted Successfully!", true);
        }
        else if (responseStatus === 403){
            setNewNotification("You cannot delete this Location!");
        }
        else if (responseStatus === 404){
            setNewNotification("Item Not Found!");
        }
        else{
            console.log("Error: ");
            setNewNotification();
        }

        setToDelete(null);
    }


    async function handleDeleteAccount(){
        const responseStatus = await serverRequestLocations("/api/account/", "DELETE", true);
        
        if (responseStatus === 204){
            handleLogout();
            setNewNotification("Account Deleted Successfully!", true);
        }
        else{
            console.log("Error: ");
            setNewNotification();
        }
    }


    async function handleSubmitAccountForm(event){
        event.preventDefault();

        setFormErrors(null);

        const fdata = new FormData(event.target);
        let temp = {};
        for (const [key, value] of fdata.entries())
            temp[key] = value;

        const [found, emptyFields] = hasEmptyValues(temp);

        if (!found){
            const [data, responseStatus] = await serverRequestUser("/api/account/", "PUT", true, temp);
        
            if (responseStatus === 200){
                dispatch(setUser(data));
                setNewNotification("Account has been updated!", true);
                setIsDisabled(true);
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
        else{
            window.scrollTo(0,0);
            // REQUEST TO GET ALL DELIVERY LOCATIONS OF USER
            (async ()=>{
                const [data, responseStatus] = await serverRequestLocations("/api/account/delivery-locations/", "GET", true);

                if (responseStatus === 200){
                    setDeliveryLocationList(data);
                }
                else{
                    console.log("Error: ", data);
                    setNewNotification();
                }
            })();
        }
    }, [token])

    
    return ( 
        user ?
        <>
            <ConfirmBox reference={confirmBoxReference} message={confirmMessage} handleConfirm={toDelete ? handleDeleteDelivaryLocation : handleDeleteAccount} confirmBtnText="Delete"/>

            <Modal reference={locationFormReference}>
                <DeliveryLocationForm setDeliveryLocationList={setDeliveryLocationList}/>
            </Modal>


            <section className="max-w-xl w-full m-auto my-8">
                <form ref={accountFormReference} onSubmit={handleSubmitAccountForm} className="pb-16 mb-16 border-dashed border-b-2 border-gray-300">
                    <div className="flex items-center justify-between gap-2 mb-8">
                        <h1 className="text-2xl leading-none">Account</h1>
                        
                        <div className="flex items-center gap-1">
                        {
                            isDisabled ?
                                <SecondaryButton iconName="edit" onClick={() => setIsDisabled(false)}>Edit</SecondaryButton>
                            :
                            <>
                                {
                                    !isProgressingUser && <PrimaryButton hover="" iconName="done" type="submit" >Save</PrimaryButton>
                                }
                                <SecondaryButton iconName="close" onClick={() => setIsDisabled(true)} >Cancel</SecondaryButton>
                            </>
                        }
                        </div>
                    </div>

                    {/* Error Messages from server on submit */}
                    {
                        formErrors?.non_field_errors ? formErrors.non_field_errors.map(error => <FormErrorMessage key={error} message={error}/>) : <></>
                    }

                    <div className="flex flex-col gap-8 mb-8">
                        <InputField disable={isDisabled} name="name" label="Name" value={user.name} placeholder="Enter Name" errors={formErrors?.name}/>

                        <InputField disable={isDisabled} name="email" type="email" label="Email" value={user.email} placeholder="Enter email" errors={formErrors?.email}/>

                        <InputField disable={isDisabled} name="phone" type="tel" label="Phone No." value={user.phone} placeholder="Enter Phone no." errors={formErrors?.phone}/>
                    </div>

                    {
                        isProgressingUser && <Loading />
                    }

                    <div className="flex flex-col sm:flex-row justify-between gap-x-2 gap-y-4 items-center">
                        <Link to="/change-password" className="w-fit flex items-center gap-2 px-4 py-2 text-base border border-gray-300 rounded-[36px]"><Icon iconName="lock_reset" /> Change Password</Link>
                    
                        <SecondaryButton onClick={()=>{
                            setToDelete(null);
                            handleOpenConfirmDeleteForAccount();
                        }} textColor="text-red-500" iconName="delete_forever">Delete Account</SecondaryButton>
                    </div>
                </form>


                {/* Delivery Locations */}
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl">Delivery Location</h1>
                        <SecondaryButton onClick={handleOpenLocationForm} iconName="add_location">Add</SecondaryButton>
                    </div>

                    {
                        isProcessingDeliveryLocations ?
                            <Loading />
                        :
                            deliveryLocationList ?
                                deliveryLocationList.length ?
                                    deliveryLocationList.map(deliveryLocation => (
                                        <DeliveryLocation key={deliveryLocation.id} deliveryLocation={deliveryLocation} setDeliveryLocationList={setDeliveryLocationList} handleOpenConfirmDelete={handleOpenConfirmDeleteForLocation}/>
                                    ))
                                :
                                    <TextMessage message="You haven't saved any Location!" />
                            :
                                <TextMessage message="Unable to load saved Locations! Try again later." />
                    }
                </div>
            </section>
        </>
        :
        <></>
     );
}