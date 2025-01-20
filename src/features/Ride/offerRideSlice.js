import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    commutes:[], // Stores multiple users
}
const offerRideSlice = createSlice({
    name:'OfferRide',
    initialState,
    reducers:{
        addCommute(state,action)
        {
            state.commutes.push(action.payload); // Add new user data to the users array
        },
    }
})
// Export actions
export const { addCommute } = offerRideSlice.actions;
// Export reducer
export default offerRideSlice.reducer;
