import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import { SecondaryButton, FilterBox, Loading, RestaurantCard, TextMessage, Modal, LocationSearchBox, PopularCuisineImages} from "../../components";

import useServerRequest from "../../helper/useServerRequest";


export default function CityRestaurants() {

    const navigate = useNavigate();
    const userSelectedCity = useSelector(state => state.userSelectedCity.selectedCity);
    const filterBoxReference = useRef(null);
    const locationBoxReference = useRef(null);

    const [isProcessing, setNewNotification, serverRequest] = useServerRequest();

    const [isProcessingRestaurants, setIsProcessingRestaurants] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [showableRestaurants, setShowableRestaurants] = useState([]);
    const [appliedFilterCount, setAppliedFilterCount] = useState(0);
    const [cuisinesByRestaurants, setCuisinesByRestaurants] = useState(null);


    function showFilters(){
        filterBoxReference.current.classList.remove("hidden");
    }

    function handleOpen(){
        if (locationBoxReference)
            locationBoxReference.current.classList.remove("hidden");
    }

    function handleClose(){
        if (locationBoxReference)
            locationBoxReference.current.classList.add("hidden");
    }


    useEffect(()=>{
        if (!userSelectedCity)
            navigate("");
    }, [])


    useEffect(()=>{
        setIsProcessingRestaurants(isProcessing);
    }, [isProcessing]);


    useEffect(()=>{
        if (userSelectedCity){
            window.scrollTo(0,0);
            // REQUEST TO GET RESTAURANTS WITH CUISINES OF EACH RESTAURANT
            (async ()=>{
                const [data, responseStatus] = await serverRequest(`/api/city/${userSelectedCity.id}/`, "GET");

                if (responseStatus === 200){
                    const restaurantsTemp = data.restaurants.map((rest, index) => (
                        [
                            rest, 
                            data.cuisines_by_restaurants[index].map(cuisine => cuisine.name.toLowerCase()).join(", ")
                        ]
                    ));
                    setRestaurants(restaurantsTemp);
                    setShowableRestaurants(restaurantsTemp);
                    setCuisinesByRestaurants(data.cuisines_by_restaurants);
                }
                else{
                    console.log("Error: ", data);
                    setNewNotification();
                }
            })();
        }
        else{
            navigate("");
        }
    }, [userSelectedCity])



    return ( 
        userSelectedCity ?
            <>
                <Modal reference={locationBoxReference}>
                    <h1 className="text-xl font-bold mb-8">Select Your City</h1>
                    <LocationSearchBox handleContinue={handleClose} navigateToRestaurants={true} />
                </Modal>


                <section className="">
                    {
                        restaurants.length ?
                            <FilterBox filterBoxReference={filterBoxReference} restaurants={restaurants} cuisinesByRestaurants={cuisinesByRestaurants} setShowableRestaurants={setShowableRestaurants} setAppliedFilterCount={setAppliedFilterCount} setIsLoading={setIsProcessingRestaurants}/>
                        :
                            <></>
                    }

                    <div className="flex justify-center">
                        <PopularCuisineImages />
                    </div>


                    <div className="flex items-center justify-between gap-y-8 flex-wrap my-16">
                        <h2 className="text-xl font-bold capitalize">Restaurants from {userSelectedCity.name.toLowerCase()}</h2>

                        <div className="flex items-center gap-2 flex-wrap">

                            <SecondaryButton iconName="edit_location_alt" onClick={handleOpen}>Change Location</SecondaryButton>

                            {/* Filter Button */}
                            <SecondaryButton iconName="filter_alt" onClick={showFilters}>Filter {appliedFilterCount && appliedFilterCount}</SecondaryButton>
                        </div>
                    </div>

                    {
                        isProcessingRestaurants ?
                            <Loading />
                        :
                            showableRestaurants.length ?
                                <div className="flex flex-wrap justify-center gap-16 my-8">
                                    {
                                        showableRestaurants.map( ([restaurant, availableCuisines]) => <RestaurantCard key={restaurant.name} restaurant={restaurant} cuisines={availableCuisines} />)
                                    }
                                </div>
                        :
                            <TextMessage message="No Results Found!" />
                    }
                </section>
            </>
        :
            <TextMessage message="Select a valid City!" />
     );
}