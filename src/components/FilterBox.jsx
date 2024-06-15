import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Modal from "./Modal";
import Icon from "./Icon";
import { PrimaryButton, SecondaryButton } from "./Button";

import { filterByCuision, filterByRating, filterByVegNonveg } from "../helper/restaurantFilters";


function FilterDropdown({category, filterTags, setFilterTags, cuisines=null}){

    function handleCheck(event){
        setFilterTags(prev => ({...prev, [event.target.value]:event.target.checked }))
    }


    return (
        <details className="my-2 p-4 border border-gray-300 rounded-[36px]">
            <summary className="cursor-pointer text-base leading-none">{category}</summary>

            <ul className="h-fit px-2 py-1 max-h-40 overflow-y-auto">
                {
                    filterTags &&
                    Object.keys(filterTags).map( (tag, index) => (
                        <li key={category + index} className="flex items-center gap-x-2 mt-4 text-zinc-500">
                            <input type="checkbox" className="accent-yellow-500 w-4 h-4" checked={filterTags[tag]} onChange={handleCheck} value={tag} id={category + index} />
                            <label className="cursor-pointer flex-1 text-zinc-500 text-base leading-none" htmlFor={category + index}>{cuisines ? cuisines.find(cuisine => cuisine.id == tag).name : tag}</label>
                        </li>
                    ))
                }
            </ul>
        </details>
    )
}


export default function FilterBox({filterBoxReference, restaurants, cuisinesByRestaurants, setShowableRestaurants, setAppliedFilterCount, setIsLoading}){

    const cuisines = useSelector(state => state.cityStateCuisine.cuisines);

    const [cuisionFilterTags, setCuisionFilterTags] = useState(null);
    const [ratingFilterTags, setRatingFilterTags] = useState({"4.5+":false , "4.0+":false , "3.5+":false });
    const [vegFilterTags, setVegFilterTags] = useState({"Veg":false, "Non-Veg":false});


    function closeFilterBox(){
        filterBoxReference.current.classList.add("hidden");
    }

    function resetValues(tags, setTags){
        const temporary = {...tags};
        for (const tag in tags)
            temporary[tag] = false;
        setTags(temporary);
    }

    function clearFilter(){
        setIsLoading(true);
        resetValues(cuisionFilterTags, setCuisionFilterTags);
        resetValues(vegFilterTags, setVegFilterTags);
        resetValues(ratingFilterTags, setRatingFilterTags);
        setAppliedFilterCount(0);
        setShowableRestaurants(restaurants);
        closeFilterBox();
        setIsLoading(false);
    }

    function applyFilter(){
        setIsLoading(true);
        let result = filterByCuision(setAppliedFilterCount, restaurants, cuisinesByRestaurants, cuisionFilterTags);
        result = filterByVegNonveg(setAppliedFilterCount, result, vegFilterTags);
        result = filterByRating(setAppliedFilterCount, result, ratingFilterTags);
        setShowableRestaurants([...result]);
        closeFilterBox();
        setIsLoading(false);
    }


    useEffect(()=>{
        if (cuisines.length){
            let temp = {};
            cuisines.forEach(cuisine => temp[cuisine.id]=false);
            setCuisionFilterTags(temp)
        }
    }, [])



    return (
        <Modal reference={filterBoxReference}>
            <h2 className="flex items-center gap-1 mb-8 text-2xl font-bold leading-none">
                <Icon iconName="filter_alt" className="font-bold"/>
                Filter
            </h2>

            <FilterDropdown category="Cuision" filterTags={cuisionFilterTags} setFilterTags={setCuisionFilterTags} cuisines={cuisines} />
            <FilterDropdown category="Veg / NonVeg" filterTags={vegFilterTags} setFilterTags={setVegFilterTags}/>
            <FilterDropdown category="Rating" filterTags={ratingFilterTags} setFilterTags={setRatingFilterTags}/>

            <div className="mt-8 grid grid-cols-2 gap-2">
                <SecondaryButton iconName="filter_alt_off" onClick={clearFilter}>Clear</SecondaryButton>
                <PrimaryButton onClick={applyFilter} iconName="done">Apply</PrimaryButton>
            </div>
        </Modal>
    )
}
