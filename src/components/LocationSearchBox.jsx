import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Icon from "./Icon";
import { IconButton } from "./Button";

import { setSelectedCity } from "../reduxStore/userSelectedCitySlice";
import { setCities } from "../reduxStore/cityStateCuisineSlice.js";

import useServerRequest from "../helper/useServerRequest.js";

export default function LocationSearchBox({navigateToRestaurants=false, handleContinue=null}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const availableLocations = useSelector(state => state.cityStateCuisine.cities);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [searchingLocation, setSearchingLocation] = useState("");
    const [resultLocations, setResultLocations] = useState([]);
    

    function handleSearchingLocation(event){
        const str = event.target.value.toLowerCase();
        if (str === "" || !availableLocations.length){
            setResultLocations([]);
        }
        else{
            setResultLocations(availableLocations.filter( eachLocation => eachLocation.name.toLowerCase().startsWith(str)));
        }
        setSearchingLocation(str);
    }


    function handleConfirmLocation(){
        let city = null;
        for (const availLocation of availableLocations){
            if (`${availLocation.name}, ${availLocation.state.name}` === searchingLocation){
                city = availLocation;
                break;
            }
        }
        
        if (city){
            dispatch(setSelectedCity(city));
            if (navigateToRestaurants)
                navigate(`/city/${city.name.toLowerCase()}`);
            if (handleContinue)
                handleContinue();
        }
    }


    useEffect(()=>{
        if (!availableLocations.length){
            // GET ALL CITIES IF NOT LOADED
            (async () => {
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


    return ( 
        <div className="">
            <div className="flex p-2 gap-2 border border-gray-300 rounded-[36px] overflow-hidden">
                <input className="flex-1 px-2 text-xl leading-none outline-none" type="search" value={searchingLocation} onChange={handleSearchingLocation} placeholder="Enter Your City Name" />
                <IconButton onClick={handleConfirmLocation} bgColor="bg-yellow-500" textColor="text-black" hover="" iconName="done"/>
            </div>

            <ul className="mt-2 max-h-64 overflow-y-auto">
                {
                    resultLocations.map( eachLocation => (
                        <li key={eachLocation.id} onClick={()=>setSearchingLocation(eachLocation.name+", "+eachLocation.state.name)} className="px-2 py-4 flex items-center gap-1 rounded-[36px] hover:bg-gray-200 cursor-pointer">
                            <Icon iconName="location_on" className="text-yellow-500"/>
                            <span className="flex-1 text-xl leading-none">{eachLocation.name}, {eachLocation.state.name}</span>
                        </li>
                        )
                    )
                }
            </ul>
        </div>
     );
}