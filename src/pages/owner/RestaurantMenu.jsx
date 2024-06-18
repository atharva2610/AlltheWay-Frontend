import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import ItemForm from "../../forms/ItemForm";

import { Loading, TextMessage, SecondaryButton, Icon, VegTag } from "../../components";

import useServerRequest from "../../helper/useServerRequest";
import { useSelector } from "react-redux";


export default function RestaurantMenu() {
    const itemFormReference = useRef(null);
    const [restaurant, setRestaurant] = useOutletContext();
    const cuisines = useSelector(state => state.cityStateCuisine.cuisines);

    const [searchValue, setSearchValue] = useState("");
    const [items, setItems] = useState(null);
    const [availableCuisines, setAvailableCuisines] = useState(null);
    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();


    function handleOpenAddItemForm(){
        itemFormReference.current.classList.remove("hidden");
    }


    useEffect(()=>{
        window.scrollTo(0,0);
        
        // REQUEST TO GET ALL MENU ITEMS
        (async ()=>{
            const [dataMenuItems, responseStatusMenuItems] = await serverRequest(`/api/owner/menu-items/${restaurant.id}/`, "GET");

            if (responseStatusMenuItems === 200){
                setItems(dataMenuItems);
            }
            else if (responseStatusMenuItems === 403){
                setNewNotification("You are not the Owner!");
            }
            else{
                console.log("Error: ", dataMenuItems);
                setNewNotification();
            }
        })();
    }, [])


    useEffect(()=>{
        if (items){
            const itemsByCuisines = {};

            items.forEach(item => {
                if (item.cuisine in itemsByCuisines)
                    itemsByCuisines[item.cuisine].push(item);
                else
                    itemsByCuisines[item.cuisine] = [item];
            })

            const offeredCuisines = [];

            Object.keys(itemsByCuisines).forEach(cuisineId => {
                offeredCuisines.push({
                    cuisine: cuisines.find(cuisine => cuisine.id == cuisineId),
                    items: itemsByCuisines[cuisineId]
                });
            })

            setAvailableCuisines(offeredCuisines);
        }
    }, [items])


    return ( 
        <>
            <ItemForm reference={itemFormReference} setItems={setItems}/>

            <div>
                <div className="flex flex-wrap justify-between items-center gap-8 pb-8 mb-8 border-b border-gray-300">
                    <h1 className="text-xl font-bold capitalize">Menu - {restaurant.name.toLowerCase()}</h1>
                    <SecondaryButton onClick={handleOpenAddItemForm} iconName="add_circle">Add New Item</SecondaryButton>
                </div>

                {
                    isProcessing ?
                        <Loading />
                    :
                        items ?
                        <>
                            {/* Item Search Box */}
                            <div className="relative mb-8">
                                <input id="searchMenuitem" className="w-full p-4 text-base md:text-xl border border-gray-300 focus:border-yellow-500 rounded-[36px] outline-none" type="search" value={searchValue} onChange={e => setSearchValue(e.target.value.toLowerCase())} placeholder="Search Items from Menu"/>
                                {
                                    searchValue && <ul className="absolute -bottom-2 translate-y-full p-2 bg-white w-full border border-gray-300 rounded-[36px]">
                                        {
                                            items.filter(item => (item.name.toLowerCase().startsWith(searchValue))).map( item => (
                                                    <Link key={item.id} to={`item/${item.id}`}>
                                                        <li key={item.name} className="p-4 text-xl md:hover:bg-gray-200 rounded-[36px] capitalize">
                                                            {item.name.toLowerCase()}
                                                        </li>
                                                    </Link>
                                                )
                                            )
                                        }
                                    </ul>
                                }
                            </div>

                            {/* Items By Cuisine */}
                            {
                                items.length ?
                                    availableCuisines?.map( ({cuisine, items}) => (
                                        <div key={cuisine.id} className="pt-8 mb-16 border-t border-gray-300">
                                            {/* Cuisine Name */}
                                            <h2 className="text-xl font-bold capitalize mb-8">{cuisine.name}</h2>

                                            {/* Items */}
                                            {
                                                items.map( item => (
                                                    <div className="flex items-center gap-2 md:gap-4 py-4 ">
                                                        <img src={item.image} className="size-16 md:size-20 rounded-lg" />
                                                        <VegTag isVeg={item.is_veg}/>
                                                        <Link to={`item/${item.id}`} className="text-lg flex-1 capitalize truncate">{item.name.toLowerCase()}</Link>
                                                        <h3 className="flex items-center text-lg"><Icon iconName="currency_rupee" /> {item.price}</h3>
                                                    </div>
                                                    ))
                                            }
                                        </div>
                                    ))
                                :
                                    <TextMessage message="No items to show! Please add some items in Menu." />
                            }

                        </>
                        :
                            <TextMessage message="An error occured! Try again later." />
                }
            </div>
        </>
     );
}