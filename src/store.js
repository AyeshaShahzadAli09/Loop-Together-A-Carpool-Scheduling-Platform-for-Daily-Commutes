import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./utils/themeSlice";

const store = configureStore({
    reducer:{
       theme : themeSlice,
    }
}
)

export default store;