import { configureStore } from "@reduxjs/toolkit";
import findRideSlice from "./features/Ride/findRideSlice";
import offerRideSlice from "./features/Ride/offerRideSlice";
import themeSlice from "./utils/themeSlice";
import feedbackSlice from "./features/Reviews/FeedbackSlice"

const store = configureStore({
    reducer:{
       findRide : findRideSlice,
       offerRide : offerRideSlice,
       theme : themeSlice,
       feedback : feedbackSlice
    }
}
)

export default store;