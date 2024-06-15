import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Analytics } from '@vercel/analytics/react';

import { Account, Base, Cart, ChangePassword, CityRestaurants, FavoriteRestaurants, Home, MyRestaurants, OrderConfirmation, OrderDetail, Orders, ResetPassword, Search, SearchByCuisine, SearchDishes, SearchRestaurant, ViewRestaurant } from "./pages/customer";
import { ActiveOrders, Dashboard, ItemDetail, NewOrders, OrderAnalysis, OrderHistory, RestaurantDetail, RestaurantMenu, RestaurantOrderDetail } from "./pages/owner";
import { Notification, Header, Footer } from "./components/";

import LoginForm from "./forms/LoginForm.jsx";
import RegistrationForm from "./forms/RegistrationForm.jsx";

import { setUser, setToken } from "./reduxStore/userSlice.js";
import { setCuisines } from "./reduxStore/cityStateCuisineSlice.js";

import useServerRequest from "./helper/useServerRequest.js";
import { baseURL } from "./configrations/backendConfig.js";



function App() {

  const dispatch = useDispatch();
  const token = localStorage.getItem("FoodOrderingUserToken");

  const [isProcessingCuisines, setNewNotification, serverRequestCuisine] = useServerRequest();
    

  useEffect(() => {
    // SEND REQUEST FOR NEW TOKEN IF TOKEN EXIST IN LOCAL STORAGE
    async function getUserRequest(){
      const response = await fetch(baseURL+"/api/account/", {
        method: "GET",
        headers: {
          "Content-Type":"application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await response.json();

      if (response.status === 200){
        dispatch(setUser(data.user));
        dispatch(setToken(data.newToken));
        localStorage.setItem("FoodOrderingUserToken", data.newToken);
      }
      else {
        console.log("Error: ", data);
        localStorage.removeItem("FoodOrderingUserToken");
      }
    }


    // SEND REQUEST TO GET ALL CUISINES
    async function getAllCuisinesRequest(){
      const [data, responseStatus] = await serverRequestCuisine("/api/owner/cuisines/", "GET");

      if (responseStatus === 200){
        dispatch(setCuisines(data));
      }
      else{
        console.log("Error: ", data);
        setNewNotification();
      }

      console.log("app file loaded!");
    }

    if (token)
      getUserRequest();
    getAllCuisinesRequest();
  }, [])


  return (
    <>
      <Analytics />
      <Notification />

      <Header />

      <Routes>
        <Route path="" element={<Base />}>
          <Route path="" element={<Home />} />
          <Route path="/signin" element={<LoginForm />} />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="city/:city" element={<CityRestaurants />} />
          <Route path="favorite" element={<FavoriteRestaurants />} />
          <Route path="popular/:searchedCuisine" element={<SearchByCuisine />} />
          <Route path="/search" element={<Search />} >
            <Route path="restaurant" element={<SearchRestaurant />} />
            <Route path="dishes" element={<SearchDishes />} />
          </Route>
          <Route path="/restaurant/:restaurant_id" element={<ViewRestaurant />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/confirm-order" element={<OrderConfirmation />} />
          <Route path="/orders" >
            <Route path="" element={<Orders />} />
            <Route path=":order_id" element={<OrderDetail />} />
          </Route>
          <Route path="/account" element={<Account />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/myrestaurants" element={<MyRestaurants />} />
        </Route>

        <Route path="/owner/:restaurant_id" element={<Dashboard />} >
          <Route path="detail" element={<RestaurantDetail />} />
          <Route path="menu">
            <Route path="" element={<RestaurantMenu />} />
            <Route path="item/:item_id" element={<ItemDetail />} />
          </Route>
          <Route path="active-orders" element={<ActiveOrders />} />
          <Route path="new-orders" element={<NewOrders />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="order-detail/:restaurant_order_id" element={<RestaurantOrderDetail />} />
          <Route path="order-analysis" element={<OrderAnalysis />} />
        </Route>
      </Routes>

      <Footer />
    </>
  )
}

export default App
