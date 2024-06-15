import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

import { Loading, RestaurantCard, TextMessage } from "../../components";

import useServerRequest from "../../helper/useServerRequest";



export default function SearchRestaurant(){

    const userSelectedCity = useSelector(state => state.userSelectedCity.selectedCity);
    const [searchFor] = useOutletContext();

    const [isProcessingRestaurants, setNewNotification, serverRequest] = useServerRequest(false);

    const [restaurants, setRestaurants] = useState(null);
    const [cuisinesByRestaurants, setCuisinesByRestaurants] = useState(null);


    useEffect(()=>{
        window.scrollTo(0,0);
        if (searchFor){
            // REQUEST TO GET RESULTS FOR SEARCHED RESTAURANT
            (async ()=>{
                const [data, responseStatus] = await serverRequest(`/api/city/${userSelectedCity.id}/search-restaurants/${searchFor}/`, "GET");

                if (responseStatus === 200){
                    setRestaurants(data.restaurants);
                    setCuisinesByRestaurants(data.cuisines_by_restaurants);
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
        isProcessingRestaurants ?
            <Loading />
        :
            restaurants ?
                restaurants.length ?
                    <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-x-4 gap-y-16 mb-16">
                    {
                        restaurants.map( (restaurant, index) => <RestaurantCard key={restaurant.name} restaurant={restaurant} cuisines={cuisinesByRestaurants[index].map(cuisine=>cuisine.name.toLowerCase()).join(", ")} />)
                    }
                    </div>
                :
                    <TextMessage message="No Results Found!" />
            :
                <TextMessage message="Unable to load Restaurants!" />
    )
}