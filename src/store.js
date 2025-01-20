import { configureStore } from "@reduxjs/toolkit";
import findRideSlice from "./features/Ride/findRideSlice";
import offerRideSlice from "./features/Ride/offerRideSlice";
import themeSlice from "./utils/themeSlice";
import feedbackSlice from "./features/Reviews/FeedbackSlice"
import chatReducer from './features/chat/chatSlice';

const store = configureStore({
    reducer:{
       findRide : findRideSlice,
       offerRide : offerRideSlice,
       theme : themeSlice,
       feedback : feedbackSlice,
       chat: chatReducer,
    }
}
)

export default store;