import { Link } from "react-router-dom";

import Icon from "./Icon";

import { baseURL } from "../configrations/backendConfig";


export default function RegisteredRestaurant({restaurant}) {
    return ( 
        <Link to={`/owner/${restaurant.id}/detail`}>
            <div className="w-80 flex flex-col gap-y-4 transition hover:-translate-y-4">
                <img className="w-full h-44 object-cover bg-gray-200 rounded-3xl myShadow" src={baseURL+restaurant.image} alt="" />
                <h2 className="flex items-center gap-1 text-lg font-bold capitalize"><Icon iconName="store" /> {restaurant.name.toLowerCase()}</h2>
                <span>{restaurant.location.full_address}</span>
            </div>
        </Link>
     );
}