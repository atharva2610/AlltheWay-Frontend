import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import { SecondaryButton, Loading, RegisteredRestaurant, TextMessage, Icon} from "../../components";

import AddRestaurant from "../../forms/AddRestaurant";
import foodsDrawing from "../../assets/foods outline drawing.jpeg";
import useServerRequest from "../../helper/useServerRequest";
import { Link } from "react-router-dom";


function NotSignedin(){

    return (
        <div className="w-[90%] md:w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 m-auto">
            <img src={foodsDrawing} alt="freepik image" className="h-56 m-auto md:h-auto"/>

            <div className="flex flex-col justify-center gap-8">
                <h1  className="text-2xl lg:text-4xl" >From local to global – take your restaurant’s flavors to the digital.</h1>
                <Link to="/signin" className="bg-black w-fit text-white hover:ring-1 hover:ring-black hover:ring-offset-4 flex items-center gap-4 px-4 py-2 rounded-[36px]">Signin to continue <Icon iconName="arrow_forward" /></Link>
            </div>
        </div>
    )
}


export default function MyRestaurants() {

    const token = useSelector(state => state.auth.token)
    
    const addRestaurantFormReference = useRef(null);

    
    const [isProcessingRestaurants, setNewNotification, serverRequest] = useServerRequest();

    const [restaurants, setRestaurants] = useState([]);


    function handleOpenForm(){
        addRestaurantFormReference.current.classList.remove("hidden");
    }


    useEffect(()=>{
        window.scrollTo(0,0);
        
        if (token){
            // REQUEST TO GET ALL RESTAURANTS REGISTERED BY USER
            (async ()=>{
                const [data, responseStatus] = await serverRequest("/api/owner/", "GET", true);

                if (responseStatus === 200){
                    setRestaurants(data);
                }
                else{
                    console.log("Error: ", data);
                    setNewNotification();
                }
            })();
        }
    }, [token])


    return ( 
        <section className="my-8">       
            {
                token ?
                    <>
                        <AddRestaurant reference={addRestaurantFormReference} setRestaurants={setRestaurants} />

                        <div className="">
                            <div className="flex flex-wrap justify-between items-center pb-8 mb-8 gap-4 border-dashed border-b-2 border-gray-300">
                                <h2 className="text-base">Add upto 5 Restaurants</h2>
                                {token && <SecondaryButton onClick={handleOpenForm} iconName="add_circle">Add New Restaurant</SecondaryButton>}
                            </div>
                            
                            {
                                isProcessingRestaurants ?
                                    <Loading />
                                :
                                    restaurants.length ?
                                        <div className="flex justify-center flex-wrap gap-x-8 gap-y-16">
                                            {
                                                restaurants.map(restaurant => <RegisteredRestaurant key={restaurant.id} restaurant={restaurant} />)
                                            }
                                            
                                        </div>
                                    :
                                    <TextMessage message={"No Restaurant To Show."} />
                            }
                        </div>
                    </>
                :
                   <NotSignedin />
            }
       </section>
     );
}