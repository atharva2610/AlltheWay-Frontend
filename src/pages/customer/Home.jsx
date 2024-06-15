import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { LocationSearchBox } from "../../components";

import allthewayLogo from "../../assets/allthewayLogo.jpeg";
import drawing1 from "../../assets/outline drawing1.jpg";
import drawing3 from "../../assets/outline drawing3.png";


export default function Home() {

    const navigate = useNavigate();
    const userSelectedCity = useSelector(state => state.userSelectedCity.selectedCity);
    
    useEffect(()=>{
        if (userSelectedCity)
            navigate(`/city/${userSelectedCity.name.toLowerCase()}`);
        window.scrollTo(0,0);
    }, [])

    return (
        <section className="max-w-2xl m-auto my-8">
            <img src={allthewayLogo} className="w-80 m-auto rounded-xl"/>

            <h2 className="mb-16 text-2xl font-bold text-center">On the way to deliver your favorite food.</h2>

            <LocationSearchBox navigateToRestaurants={true}/>

            <div className="hidden lg:block -z-10 absolute top-48 right-[4vw] size-[16vw]">
                <img src={drawing3} alt="freepik.com/" />
            </div>

            <div className="hidden lg:block -z-10 absolute bottom-12 left-[2vw] size-[20vw]">
                <img src={drawing1} alt="freepik.com/" />
            </div>
        </section>
    );
}