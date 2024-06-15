import { useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { IconButton } from "./Button";
import Icon from "./Icon";

const navigations = [
    {to: "", icon: "home", text: "Home"},
    {to: "cart", icon: "shopping_cart", text: "Cart"},
    {to: "favorite", icon: "favorite", text: "Favorite"},
    {to: "search/restaurant", icon: "search", text: "Search"},
    {to: "myrestaurants", icon: "store", text: "My Restaurants"},
]

const authenticatedNavigations = [
    {to:"orders", icon: "orders", text:"Orders"},
    {to:"account", icon: "person", text:"Account"},
]

function SmallScreenNaviagation({navigationContainerReference, token, cartItemCount}){

    function handleCloseNav(){
        navigationContainerReference.current.classList.add("hidden");
    }
    
    return (
        <section ref={navigationContainerReference} className="z-50 hidden fixed top-0 left-0 right-0 bottom-0 bg-[rgba(255, 255, 255, 0.4)] backdrop-blur">
            <div className="bg-white w-80 lg:w-fit h-full lg:h-fit flex flex-col pr-8 py-8 lg:py-0 lg:pr-0 ml-auto myShadow">
                <IconButton iconName="close" extraCSS="lg:hidden mb-8 ml-auto" onClick={handleCloseNav}/>
                
                {
                    navigations.map( navigationLink => (
                        <NavLink key={navigationLink.text} to={navigationLink.to} onClick={handleCloseNav} className={({isActive})=>(isActive ? "bg-yellow-500" : "bg-transparent") + " flex items-center gap-2 px-8 py-5 text-base rounded-r-[36px]"}>
                            <Icon iconName={navigationLink.icon}/>
                            {navigationLink.text}{navigationLink.text === "Cart" && cartItemCount != 0 && <span className="bg-yellow-500 px-2 py-1 rounded-[50%]">{cartItemCount}</span>}
                        </NavLink>
                    ))
                }

                {
                    token && (authenticatedNavigations.map( navigationLink => (
                        <NavLink key={navigationLink.text} to={navigationLink.to} onClick={handleCloseNav} className={({isActive})=>(isActive ? "bg-yellow-500" : "bg-transparent") + " flex items-center gap-2 px-8 py-5 text-base rounded-r-[36px]"}>
                            <Icon iconName={navigationLink.icon}/>
                            {navigationLink.text}
                        </NavLink>
                    )))
                }
            </div>
        </section>
    )
}


export default function MainNav() {
    
    const token = useSelector(state => state.auth.token);
    const cartItemCount = useSelector(state => state.cart.cartItemCount);
    const navigationContainerReference = useRef(null);

    // Open Navigations tab in mobile devices
    function handleOpenNav(){
        navigationContainerReference.current.classList.remove("hidden");
    }

    return (
        <>
            <SmallScreenNaviagation navigationContainerReference={navigationContainerReference} token={token} cartItemCount={cartItemCount}/>
            
            <section className="px-4 md:px-16 mb-8">
                {/* Menu button to open Mobile Navigation */}
                <IconButton onClick={handleOpenNav} iconName="menu_open" extraCSS="lg:hidden ml-auto"/>

                <div className="hidden lg:flex items-center justify-center gap-2 overflow-x-auto">
                {
                    navigations.map(navigation => (
                        <NavLink key={navigation.text} to={navigation.to} className={({isActive})=>(isActive ? "border-yellow-500" : "border-transparent") + " shrink-0 flex items-center gap-1 px-4 py-2 text-base leading-none border-2 hover:border-yellow-500 rounded-[36px]"}>
                            <Icon iconName={navigation.icon} />
                            {navigation.text}{navigation.text === "Cart" && cartItemCount != 0 && <span className="bg-yellow-500 px-2 py-1 rounded-[50%]">{cartItemCount}</span>}
                        </NavLink>
                    ))
                }

                {
                    token && (
                        authenticatedNavigations.map(navigation => (
                            <NavLink key={navigation.text} to={navigation.to} className={({isActive})=>(isActive ? "border-yellow-500" : "border-transparent") + " shrink-0 flex items-center gap-1 px-4 py-2 text-base leading-none border-2 hover:border-yellow-500 rounded-[36px]"}>
                                <Icon iconName={navigation.icon} />
                                {navigation.text}
                            </NavLink>
                        ))

                    )
                }
                </div>
            </section>
        </>
     );
}