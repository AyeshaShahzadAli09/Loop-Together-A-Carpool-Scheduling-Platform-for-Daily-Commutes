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

// , setAdditionalNotes,setAvailableSeats,setDepartureDate,setDepartureLocation,setDepartureTime,setDestinationLocation,setGender,setName,setPrice,setVehicleType

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
        // setAvailableSeats(state,action)
        // {
        //     state.availableSeats = action.payload;
        // },
        // setPrice(state,action)
        // {
        //     state.pricePerSeat = action.payload;
        // },
        // setAdditionalNotes(state,action)
        // {
        //     state.additionalNotes = action.payload;
        // },
        // setVehicleType(state,action)
        // {
        //     state.vehicleType = action.payload;
        // },
        // setGender(state,action)
        // {
        //     state.gender = action.payload;
        // }