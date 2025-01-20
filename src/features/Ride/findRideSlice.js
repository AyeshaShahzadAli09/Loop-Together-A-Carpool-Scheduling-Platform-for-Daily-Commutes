import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    commutes:[], // Stores multiple users
}
const findRideSlice = createSlice({
    name:'FindRide',
    initialState,
    reducers:{
        addCommute(state,action)
        {
            state.commutes.push(action.payload); // Add new user data to the users array
        },
    }
})

export const {addCommute} = findRideSlice.actions;
// Export reducer
export default findRideSlice.reducer;