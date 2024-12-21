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
        // setName(state,action){
        //     //payload  = name
        //     state.name = action.payload;
        // },
        // setDepartureLocation(state, action)
        // {
        //     //payload  = DepartureLocation
        //     state.departureLocation = action.payload;
        // },
        // setDestinationLocation(state,action) 
        // {
        //     state.destinationLocation = action.payload;
        // } ,
        // setDepartureDate(state,action)
        // {
        //     state.departureDate = action.payload;
        // },
        // setDepartureTime(state,action)
        // {
        //     state.departureTime = action.payload;
        // },
        // setAdditionalNotes(state,action)
        // {
        //     state.additionalNotes = action.payload;
        // },
        // setGender(state,action)
        // {
        //     state.gender = action.payload;
        // }
    }
})

// Export actions
export const { addCommute , setAdditionalNotes,setDepartureDate,setDepartureLocation,setDepartureTime,setDestinationLocation,setGender,setName} = findRideSlice.actions;

// export const {addCommute} = rideSlice.actions;
// Export reducer
export default findRideSlice.reducer;