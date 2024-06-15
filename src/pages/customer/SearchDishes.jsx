import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";

import { Icon, ItemCard, ItemModal, Loading, QuantityChangeButtons, TextMessage } from "../../components";

import useServerRequest from "../../helper/useServerRequest";


export default function SearchDishes(){

    const userSelectedCity = useSelector(state => state.userSelectedCity.selectedCity);
    const [searchFor] = useOutletContext();
    const itemModalReference = useRef(null);

    const [isProcessingDishes, setNewNotification, serverRequest] = useServerRequest();

    const [dishesByRestaurants, setDishesByRestaurants] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [viewItem, setViewItem] = useState(null);


    function handleOpenItemModal(toViewItem, viewRestaurant){
        setViewItem(toViewItem);
        setRestaurant(viewRestaurant);
        itemModalReference.current.classList.remove("hidden");
    }


    useEffect(()=>{
        window.scrollTo(0,0);
        if (searchFor){
            // REQUEST TO GET RESULTS FOR SEARCHED DISH
            (async ()=>{
                const [data, responseStatus] = await serverRequest(`/api/city/${userSelectedCity.id}/search-dishes/${searchFor}/`, "GET");

                if (responseStatus === 200){
                    setDishesByRestaurants(data);
                }
                else if (responseStatus === 404){
                    // show no results found message
                }
                else{
                    console.log("Error: ", data);
                    setNewNotification();
                }
            })();
        }
    }, [searchFor])


    return (
        isProcessingDishes ?
            <Loading />
        :
            dishesByRestaurants ?
                dishesByRestaurants.length ?
                <>
                    <ItemModal reference={itemModalReference} item={viewItem} restaurant={restaurant}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-x-4 gap-y-16 mb-16">
                    {
                        dishesByRestaurants.map(dishesByRestaurant => (
                            dishesByRestaurant.items.map( item =>(
                                <ItemCard key={item.id} 
                                    item={item} 
                                    restaurantInfo={(
                                        <div className="mb-8">
                                            <Link to={`/restaurant/${dishesByRestaurant.restaurant}`}>
                                                <h2 className="flex gap-2 mb-4 text-xl font-bold capitalize">
                                                    <Icon iconName="store" />
                                                    {dishesByRestaurant.restaurant.name.toLowerCase()}
                                                </h2>
                                            </Link>
                        
                                            <h3 className="text-base">{dishesByRestaurant.restaurant.location.full_address}</h3>
                                        </div>
                                    )} 
                                    handleViewDetail={()=>handleOpenItemModal(item, dishesByRestaurant.restaurant)} 
                                    quantityChangeButtons={dishesByRestaurant.restaurant.temporary_close ? <></> : <QuantityChangeButtons selectedRestaurantId={dishesByRestaurant.restaurant.id} selectedRestaurantName={dishesByRestaurant.restaurant.name} itemId={item.id}/>}
                                    />
                            ))
                        ))
                    }
                    </div>
                </>
                :
                    <TextMessage message="No Results Found!" />
            :
                <TextMessage message="Unable to load Dishes!" />
    )
}