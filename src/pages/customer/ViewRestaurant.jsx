import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { Icon, IconButton, ItemCard, ItemModal, Loading, QuantityChangeButtons, TextMessage, VegTag } from "../../components";

import useServerRequest from "../../helper/useServerRequest";

import { useDispatch, useSelector } from "react-redux";
import { addToFavorite, removeFromFavorite } from "../../reduxStore/favoriteRestaurantsSlice";


function ViewRestaurant() {
    
    const dispatch = useDispatch();
    const {restaurant_id} = useParams();
    const itemModalReference = useRef(null);
    const favoriteRestaurants = useSelector(state => state.favoriteRestaurants.favorites);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [restaurant, setRestaurant] = useState(null);
    const [availableCuisines, setAvailableCuisines] = useState(null);
    const [items, setItems] = useState(null);
    const [viewItem, setViewItem] = useState(null);




    function handleOpenItemModal(){
        itemModalReference.current.classList.remove("hidden");
    }

    function isFavorite(){
        return favoriteRestaurants.includes(restaurant.id);
    }

    function handleFavorite(){
        if (isFavorite())
            dispatch(removeFromFavorite(restaurant.id));
        else
            dispatch(addToFavorite(restaurant.id));
    }

    
    useEffect(()=>{
        window.scrollTo(0,0);
        
        // GET RESTAURANT & CUISINES BY RESTAURANT REQUEST
        (async ()=>{
            const [dataRestaurant, responseStatusRestaurant] = await serverRequest(`/api/owner/${restaurant_id}/`, "GET");
            const [dataMenuItems, responseStatusMenuItems] = await serverRequest(`/api/owner/menu-items/${restaurant_id}/`, "GET");
            const [dataCuisines, responseStatusCuisines] = await serverRequest(`/api/owner/cuisines-by-restaurant/${restaurant_id}/`, "GET");
            
            if (responseStatusRestaurant === 200){
                setRestaurant(dataRestaurant);
            }
            else if (responseStatusRestaurant === 404){
                setNewNotification("Restaurant Not Found!");
            }
            else {
                console.log("Error: ", dataRestaurant);
                setNewNotification();
            }

            
            if (responseStatusMenuItems === 200){
                setItems(dataMenuItems);
            }
            else if (responseStatusMenuItems === 404){
                setNewNotification("Restaurant Not Found!");
            }
            else {
                console.log("Error: ", dataMenuItems);
                setNewNotification();
            }


            if (responseStatusCuisines === 200){
                setAvailableCuisines(dataCuisines);
            }
            else if (responseStatusCuisines === 404){
                setNewNotification("Restaurant Not Found!");
            }
            else {
                console.log("Error: ", dataCuisines);
                setNewNotification();
            }
        })();
    }, [])


    return ( 
        <>
            <ItemModal reference={itemModalReference} item={viewItem}/>

            <section className="relative max-w-3xl m-auto">
                
                {restaurant?.temporary_close && <div className="z-10 absolute top-20 left-0 bg-red-500 w-full p-2 text-white text-xl text-center myShadow">Temporary Close</div>}

                {
                    isProcessing ?
                        <Loading />
                    :
                        restaurant ?
                        <>
                            <IconButton onClick={handleFavorite} iconName="favorite" textColor={isFavorite() ? "text-red-500" : "text-zinc-500"} hover="" extraCSS="ml-auto mb-8 border border-gray-300 active:scale-110 active:bg-red-200"/>

                            <div className={restaurant.temporary_close ? "grayscale" : ""}>

                                {/* Restaurant Details */}
                                <div className="flex flex-col gap-4 mb-16">

                                    <img className="bg-gray-200 w-full h-40 sm:h-64 md:h-80 mb-8 object-cover rounded-3xl myShadow" src={restaurant.image} alt="" />

                                    {/* Restaurant Name */}
                                    <h1 className="flex items-center gap-2 text-2xl capitalize">
                                        <Icon iconName="store"/>
                                        {restaurant.name.toLowerCase()}
                                    </h1>

                                    {/* Veg / None-Veg */}
                                    <div className="flex items-center gap-2 text-base">
                                        <VegTag isVeg={restaurant.veg}/>
                                        {restaurant.veg ? "Pure Veg" : "Veg/Non-Veg"}
                                    </div>

                                    {/* Rating */}
                                    <div  className="flex items-center gap-2 text-base">
                                        <Icon iconName="star" className="text-yellow-500"/>{restaurant.rating.average_rating ? restaurant.rating.average_rating+" Rating" : "No rating"}
                                    </div>


                                    {/* Cuisines Available */}
                                    <div className="flex items-center gap-2 text-base capitalize">
                                        <Icon iconName="restaurant_menu" /> {availableCuisines?.map(availableCuisine => availableCuisine.name.toLowerCase()).join(", ") }
                                    </div>
                                    
                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-base">
                                        <Icon iconName="location_on" />{restaurant.location.full_address}
                                    </div>
                                    
                                    {/* Licence */}
                                    <div className="flex items-center gap-2 text-base">
                                        <Icon iconName="id_card" /> Licence No. : {restaurant.license}
                                    </div>

                                </div>


                                {/* Menu Category links */}
                                <div className="z-10 sticky top-0 bg-white w-full flex gap-4 py-4 my-16 overflow-x-auto">
                                    {
                                        availableCuisines?.map( cuisine => (<a href={`#${cuisine.name}`} key={cuisine.name} className="shrink-0 px-4 py-2 text-base border border-black rounded-[36px] capitalize">{cuisine.name.toLowerCase()}</a>) )
                                    }
                                </div>

                                
                                {/* Category */}
                                {
                                    availableCuisines?.map( cuisine => (    
                                        <div id={cuisine.name} key={cuisine.id} className="mb-16 border-dashed border-t-2 border-gray-300">
                                            <h1 className="my-16 text-2xl font-bold capitalize">{cuisine.name.toLowerCase()}</h1>

                                            {/* Items */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-16 place-items-center">
                                                {
                                                    items?.filter(item => item.cuisine == cuisine.id).map( item => (
                                                        <ItemCard key={item.id}
                                                            item={item} 
                                                            handleViewDetail={()=>{
                                                                setViewItem(item);
                                                                handleOpenItemModal();
                                                            }}
                                                            quantityChangeButtons={(
                                                                !restaurant.temporary_close && <QuantityChangeButtons selectedRestaurantId={restaurant.id} itemId={item.id} selectedRestaurantName={restaurant.name} />
                                                            )}/>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    :
                        <TextMessage message="Restaurant Not Found!" />

                }
                
            </section>
        </>
     );
}

export default ViewRestaurant;