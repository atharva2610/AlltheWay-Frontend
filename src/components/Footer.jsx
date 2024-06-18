import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import allthewayLogo from "../assets/atwLogo.png";

import { setSelectedCity } from "../reduxStore/userSelectedCitySlice";


export default function Footer() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cities = useSelector(state => state.cityStateCuisine.cities);

    const popularCities = ["mumbai", "delhi", "bengaluru", "chennai", "hyderabad", "lucknow", "kanpur"];

    function handleClick(city){
        dispatch(setSelectedCity(cities.find(eachCity => eachCity.name.toLowerCase() === city)));
        navigate(`/city/${city}`);
    }


    return ( 
        <footer className="bg-black flex flex-wrap justify-between gap-16 px-8 md:px-16 py-16 text-white">
            
            <div>
                <img src={allthewayLogo} className="size-20 rounded-[50%]" />
                <h2 className="mt-4 text-lg">© 2024 - alltheway</h2>
            </div>

            <div className="flex flex-wrap gap-32">
                <ul>
                    <li className="mb-2 text-lg">Popular Cities :</li>
                    {
                        popularCities.map(city => <li key={city} onClick={()=>handleClick(city)} className="cursor-pointer mb-2 text-base capitalize hover:text-yellow-500">{city}</li>)
                    }
                </ul>

                <ul>
                    <li className="mb-2 text-lg">Company :</li>
                    <li className="mb-2 text-base capitalize hover:text-yellow-500"><Link to="/myrestaurants" >Register restaurant</Link></li>
                    <li className="mb-2 text-base capitalize hover:text-yellow-500"><a href="https://atharvav26.vercel.app/alltheway" target="_blank" >About us</a></li>
                    <li className="mb-2 text-base capitalize hover:text-yellow-500"><a href="mailto:atharvavishwakarma526@gmail.com">Contact Us</a></li>
                    <li className="mb-2 text-base capitalize hover:text-yellow-500"><a href="https://atharvav26.vercel.app" target="_blank" >About Developer</a></li>
                </ul>
            </div>
        </footer>
     );
}