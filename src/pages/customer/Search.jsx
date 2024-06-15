import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

import { IconButton, Icon, TextMessage, LocationSearchBox, PopularCuisineImages } from "../../components";
import { useSelector } from "react-redux";


export default function Search() {

    const navigate = useNavigate();
    const userSelectedCity = useSelector(state => state.userSelectedCity.selectedCity);
    
    const [searchFor, setSearchFor] = useState("");


    function handleSearch(event){
        event.preventDefault();
        setSearchFor(event.target.searchBox.value);
    }

    useEffect(()=>{
        if(window.location.pathname.endsWith("search") || window.location.pathname.endsWith("search/"))
            navigate("restaurant");
    }, [])


    return ( 
        userSelectedCity ?
            <section className="max-w-3xl m-auto my-8">
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex items-center p-2 border border-gray-300 rounded-[36px]">
                        <input className="peer bg-transparent flex-1 pl-2 text-base md:text-xl outline-none" type="text" name="searchBox" placeholder="Search" />
                        <IconButton type="submit" iconName="search" bgColor="bg-yellow-500" textColor="text-black" hover=""/>
                    </div>
                </form>

                <div className="flex items-center gap-4 mb-8">
                    <NavLink to="restaurant" className={({isActive})=>(isActive ? "border-b-yellow-500" : "border-transparent") + " shrink-0 flex items-center gap-1 px-4 py-2 text-base leading-none border-b-2 md:hover:border-b-yellow-500"}>
                        <Icon iconName="store" />
                        Restaurant
                    </NavLink>

                    <NavLink to="dishes" className={({isActive})=>(isActive ? "border-b-yellow-500" : "border-transparent") + " shrink-0 flex items-center gap-1 px-4 py-2 text-base leading-none border-b-2 md:hover:border-b-yellow-500"}>
                        <Icon iconName="fastfood" />
                        Dishes
                    </NavLink>
                </div>

                <PopularCuisineImages />

                <h2 className="text-xl md:text-2xl capitalize mb-16">Search in {userSelectedCity.name.toLowerCase()} city</h2>

                {searchFor && <Outlet context={[searchFor]}/>}
            </section>
        :
            <div className="max-w-3xl m-auto">
                <h1 className="text-xl font-bold mb-4">Select Your City</h1>
                <LocationSearchBox />
            </div>
     );
}