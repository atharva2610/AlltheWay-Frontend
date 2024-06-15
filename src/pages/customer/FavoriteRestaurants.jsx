import { useSelector } from "react-redux";

import { Loading, RestaurantCard, TextMessage } from "../../components";
import useServerRequest from "../../helper/useServerRequest";
import { useEffect, useState } from "react";

export default function FavoriteRestaurants(){

    const favoriteRestaurants = useSelector(state => state.favoriteRestaurants.favorites);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [restaurants, setRestaurants] = useState(null);

    useEffect(()=>{
        window.scrollTo(0,0);
        if (favoriteRestaurants.length){
            // REQUEST TO GET RESTAURANTS
            (async ()=>{
                const [data, responseStatus] = await serverRequest(`/api/favorite-restaurants/${favoriteRestaurants}/`, "GET");

                if (responseStatus === 200){
                    const restaurantsTemp = data.restaurants.map((rest, index) => (
                        [
                            rest, 
                            data.cuisines_by_restaurants[index].map(cuisine => cuisine.name.toLowerCase()).join(", ")
                        ]
                    ));
                    setRestaurants(restaurantsTemp);
                }
                else if (responseStatus === 404){
                    setNewNotification("Restaurant Not Found!");
                }
                else
                    setNewNotification();
            })();
        }
    }, [])


    useEffect(()=>{
        if (favoriteRestaurants.length && restaurants){
            setRestaurants(prev => prev.filter(([restaurant, _]) => favoriteRestaurants.includes(restaurant.id)));
        }
    }, [favoriteRestaurants])


    return (
        <section className="my-8">
            <h1 className="text-2xl font-bold mb-16">Favorite Restaurants</h1>

            {
                favoriteRestaurants.length ?
                    <div className="flex flex-wrap gap-16 justify-center">
                        {
                            isProcessing ?
                                <Loading />
                            :
                                restaurants ?
                                    restaurants.map( ([restaurant, availableCuisines]) => <RestaurantCard key={restaurant.name} restaurant={restaurant} cuisines={availableCuisines} />)
                                :
                                    <TextMessage message="Unable To Load Restaurants!" />
                        }
                    </div>
                :
                    <TextMessage message="No Favorite Restaurant!" />
            }
        </section>
    )
}