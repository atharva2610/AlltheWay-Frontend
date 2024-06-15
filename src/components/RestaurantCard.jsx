import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { IconButton } from "./Button";
import Icon from "./Icon";
import VegTag from "./VegTag";

import { addToFavorite, removeFromFavorite } from "../reduxStore/favoriteRestaurantsSlice";

import { baseURL } from "../configrations/backendConfig";


export default function RestaurantCard({restaurant, cuisines}) {

    const dispatch = useDispatch();

    const favoriteRestaurants = useSelector(state => state.favoriteRestaurants.favorites);

    function isFavorite(){
        return favoriteRestaurants.includes(restaurant.id);
    }

    function handleFavorite(){
        isFavorite() ? dispatch(removeFromFavorite(restaurant.id)) : dispatch(addToFavorite(restaurant.id));
    }

    return ( 
        <div>   
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-base font-bold">
                        <VegTag isVeg={restaurant.veg} />
                        {restaurant.veg ? "Pure Veg" : "Veg/Non-Veg"}
                    </div>

                    <span className="flex items-center gap-1 text-base font-bold leading-none">
                        <Icon iconName="kid_star" className="text-yellow-500"/> 
                        {restaurant.rating.average_rating ? restaurant.rating.average_rating : "No rating"}
                    </span>
                </div>

                <IconButton onClick={handleFavorite} iconName="favorite" textColor={isFavorite() ? "text-red-500" : "text-zinc-500"} hover="" extraCSS="border border-gray-300 active:scale-110 active:bg-red-200" />
            </div>

            <Link to={`/restaurant/${restaurant.id}`} className={`relative w-80 flex flex-col gap-4 ${restaurant.temporary_close ? "grayscale" : ""}`}>
                {restaurant.temporary_close && <div className="z-10 absolute top-1/3 left-0 bg-red-500 w-80 p-2 text-white text-xl text-center myShadow">Temporary Close</div>}
                
                <img className="bg-gray-200 w-full h-44 object-cover rounded-3xl myShadow" src={`${baseURL}${restaurant.image}`} alt="" />

                <div className="flex items-center gap-2">
                    <Icon iconName="store"/>
                    <h2 className="text-2xl leading-none capitalize truncate">{restaurant.name.toLowerCase()}</h2>
                </div>

                <div className="flex items-center gap-1">
                    <Icon iconName="location_on"/>
                    <h2 className="text-base capitalize truncate">{restaurant.location.area.toLowerCase()}</h2>
                </div>
                
                <div className="flex gap-1">
                    <Icon iconName="restaurant_menu" />
                    <p className="text-base capitalize truncate">{cuisines}</p>
                </div>
            </Link>
        </div>
     );
}