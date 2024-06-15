import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import { Icon, ItemCard, Loading, ItemModal, PopularCuisineImages, TextMessage } from "../../components";

import useServerRequest from "../../helper/useServerRequest";

export default function SearchByCuisine(){

    const userSelectedCity = useSelector(state => state.userSelectedCity.selectedCity);
    const {searchedCuisine} = useParams();
    const itemModalReference = useRef(null);

    const [isProcessingDishes, setNewNotification, serverRequest] = useServerRequest(false);

    const [dishesByRestaurants, setDishesByRestaurants] = useState(null);
    const [searchFor, setSearchFor] = useState(searchedCuisine.toLowerCase());
    const [viewItem, setViewItem] = useState(null);
    const [restaurant, setRestaurant] = useState(null);


    function handleOpenItemModal(toViewItem, viewRestaurant){
        setViewItem(toViewItem);
        setRestaurant(viewRestaurant);
        itemModalReference.current.classList.remove("hidden");
    }


    useEffect(()=>{
        setSearchFor(searchedCuisine);
    }, [searchedCuisine])


    useEffect(()=>{
        window.scrollTo(0,0);
        
        // REQUEST TO GET RESULTS FOR SEARCHED CUISINE
        (async ()=>{
            const [data, responseStatus] = await serverRequest(`/api/city/${userSelectedCity.id}/search-dishes/${searchFor}/`, "GET");

            if (responseStatus === 200){
                setDishesByRestaurants(data);
            }
            else if (responseStatus === 404){
                // show No results found message
            }
            else{
                console.log("Error: ", data);
                setNewNotification();
            }
        })();
    }, [searchFor])


    return (
        <section className="max-w-3xl m-auto my-8">
            <PopularCuisineImages />

            {
                isProcessingDishes ?
                    <Loading />
                :
                    dishesByRestaurants ?
                        dishesByRestaurants.length ?
                            <>
                                <ItemModal reference={itemModalReference} item={viewItem} restaurant={restaurant}/>
                                        
                                <h2 className="mb-16 text-xl font-bold capitalize">Results for {searchFor.toLowerCase()}</h2>

                                <div  className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-x-4 gap-y-16 mb-16">
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
            }
        </section>
    )
}