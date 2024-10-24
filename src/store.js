import { configureStore } from "@reduxjs/toolkit";
import rideSlice from "./features/Ride/rideSlice";
// import cartSlice from "./features/cart/cartSlice";

const store = configureStore({
    reducer:{
       ride : rideSlice,
        // cart: cartSlice,
    }
}
)

export default store;