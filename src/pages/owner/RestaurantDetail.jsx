import { useOutletContext } from "react-router-dom";
import { useEffect, useRef } from "react";

import { PrimaryButton, SecondaryButton, IconButton, Icon, InformationField, ToggleButton, VegTag, ConfirmBox, Loading } from "../../components";

import LocationForm from "../../forms/LocationForm";
import ImageForm from "../../forms/ImageForm";

import useServerRequest from "../../helper/useServerRequest";

import { baseURL } from "../../configrations/backendConfig";


export default function RestaurantDetail() {

    const locationFormReference = useRef(null);
    const confirmBoxReference = useRef(null);
    const imageFormReference = useRef(null);
    const [restaurant, setRestaurant] = useOutletContext();

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();


    function handleOpenImageForm(){
        imageFormReference.current.classList.remove("hidden");
    }

    async function handleConfirmDelete(){
        const responseStatus = await serverRequest(`/api/owner/delete-restaurant/${restaurant.id}/`, "DELETE", true);

        if (responseStatus === 204){
            setRestaurant(null);
            setNewNotification("Restaurant Deleted Successfully!", true);
        }
        else if (responseStatus === 400){
            setNewNotification("Complete the existing Orders to delete!")
        }
        else if (responseStatus === 403){
            setNewNotification("You cannot delete this Restaurant!");
        }
        else if (responseStatus === 404){
            setNewNotification("Restaurant Not Found!");
        }
        else{
            console.log("Error: ", data);
            setNewNotification();
        }
    }

    function handleOpenConfirmDelete(){
        confirmBoxReference.current.classList.remove("hidden");
    }

    function handleOpenLocationForm(){
        locationFormReference.current.classList.remove("hidden");
    }

    useEffect(()=>{
        window.scrollTo(0,0);
    }, [])


    if (isProcessing)
        return <Loading />


    return (
        <>
            <ImageForm reference={imageFormReference} urlPath={`change-restaurant-banner/${restaurant.id}/`} setData={setRestaurant}/>

            <ConfirmBox reference={confirmBoxReference} message="Restaurant will be deleted permanently!" handleConfirm={handleConfirmDelete} confirmBtnText="Delete"/>

            <LocationForm reference={locationFormReference} setRestaurant={setRestaurant} location={restaurant.location}/>
            
            <div className="">
                {/* Outlet Banner Image Container */}
                <div className="mb-8">
                    {/* Image */}
                    <img className="bg-gray-200 w-full h-48 sm:h-64 md:h-96 object-cover rounded-[36px] myShadow" src={restaurant.image} alt="" />

                    {/* button to open Image Form */}
                    <SecondaryButton iconName="add_photo_alternate" extraCSS="ml-auto my-8" onClick={handleOpenImageForm} >Change Image</SecondaryButton>
                </div>


                {/* Pure Veg Toggle Button */}
                <div className="flex items-center gap-2 mb-8">
                    <VegTag isVeg={restaurant.veg}/>
                    <h2 className="text-lg mr-4">{restaurant.veg ? "Pure Veg" : "Veg / Non Veg"}</h2>
                    <ToggleButton fieldName="veg" restaurantId={restaurant.id} setRestaurant={setRestaurant} isDefaultChecked={restaurant.veg}/>
                </div>


                {/* Outlet Name */}
                <InformationField restaurantId={restaurant.id} setRestaurant={setRestaurant} label="Restaurant Name" name="name" placeholder="Restaurant Name" icon="store" info={restaurant.name} />
                

                {/* Rating */}
                <h2 className="flex items-center gap-2 mb-8 text-lg">
                    <Icon iconName="kid_star"/>
                    {restaurant.rating.average_rating ? `${restaurant.rating.average_rating} Rating` : "No rating"}
                </h2>


                {/* Contact No. */}
                <InformationField restaurantId={restaurant.id} setRestaurant={setRestaurant} label="Contact No." name="phone" placeholder="Contact No." icon="phone" info={restaurant.phone} />


                {/* License No. */}
                <InformationField restaurantId={restaurant.id} setRestaurant={setRestaurant} label="Licence No." name="license" placeholder="Licence No." icon="id_card" info={restaurant.license} />


                {/* Location */}
                <div className="flex items-center gap-2 mb-8">
                    <Icon iconName="location_on"/>
                    <h2 className="flex-1 text-base md:text-xl">{restaurant.location.full_address}</h2>
                    <IconButton iconName="edit" onClick={handleOpenLocationForm}/>
                </div>


                <div className="flex flex-col sm:flex-row items-center gap-8 justify-between pt-8 mt-8 border-dashed border-t-2 border-gray-300">
                    {/* Temporary Close button container */}
                    <div className="flex items-center gap-x-4">
                        <span className="text-lg">Temporary Close</span>
                        <ToggleButton fieldName="temporary_close" restaurantId={restaurant.id} setRestaurant={setRestaurant} isDefaultChecked={restaurant.temporary_close} checkedColor="bg-red-500" uncheckedColor="bg-zinc-500"/>
                    </div>

                    {/* Delete Outlet button */}
                    <PrimaryButton iconName="delete_forever" bgColor="bg-red-500" textColor="text-white" onClick={handleOpenConfirmDelete}>Delete Restaurant</PrimaryButton>
                </div>
            </div>
        </>
     );
}