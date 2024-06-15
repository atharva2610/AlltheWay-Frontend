import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import atwLogo from "../assets/atwLogo.png";
import { PrimaryButton, SecondaryButton } from "../components";

import { setToken, setUser } from "../reduxStore/userSlice";
import { setFavorites } from "../reduxStore/favoriteRestaurantsSlice";
import { setSelectedCity } from "../reduxStore/userSelectedCitySlice";
import { clearCart } from "../reduxStore/cartSlice";

export default function Header() {
    
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);

    function handleLogout(){
        localStorage.clear();
        dispatch(clearCart());
        dispatch(setFavorites([]));
        dispatch(setSelectedCity(null));
        dispatch(setUser(null));
        dispatch(setToken(null));
    }

    return ( 
        <header className="px-4 md:px-16 py-8 flex justify-between items-center">
            <Link to="/" className="">
                <img src={atwLogo} className="size-14 rounded-[50%]" />
            </Link>
        
            <div className="flex items-center gap-2">
                {
                    token ?
                        <PrimaryButton iconName="logout" onClick={handleLogout}>SignOut</PrimaryButton>
                    :
                    <>
                        <Link to="/signin">
                            <SecondaryButton iconName="login">SignIn</SecondaryButton>
                        </Link>
                        
                        <Link to="/signup">
                            <PrimaryButton iconName="person_add">SignUp</PrimaryButton>
                        </Link>
                    </>
                }
            </div>
        </header>
     );
}