import { createSlice } from "@reduxjs/toolkit"

const initialState = {
        departureLocation: '',
        destinationLocation: '',
        departureDate: '',
        departureTime: '',
        vehicleType : '',
        availableSeats: '',
        pricePerSeat: '',
        additionalNotes: ''
    }
const rideSlice = createSlice({
    name:'ride',
    initialState,
    reducers:{
        setDepartureLocation(state, action)
        {
            //payload  = DepartureLocation
            state.departureLocation = action.payload;
        },
        setDestinationLocation(state,action) 
        {
            state.destinationLocation = action.payload;
        } ,
        setDepartureDate(state,action)
        {
            state.departureDate = action.payload;
        },
        setDepartureTime(state,action)
        {
            state.departureTime = action.payload;
        },
        setAvailableSeats(state,action)
        {
            state.availableSeats = action.payload;
        },
        setPrice(state,action)
        {
            state.pricePerSeat = action.payload;
        },
        setAdditionalNotes(state,action)
        {
            state.additionalNotes = action.payload;
        },
        setVehicleType(state,action)
        {
            state.vehicleType = action.payload;
        }
    }
})

// Export actions
export const { setDepartureLocation , setDestinationLocation , setDepartureDate,setDepartureTime, setAvailableSeats, setPrice,setAdditionalNotes , setVehicleType} = rideSlice.actions;
// Export reducer
export default rideSlice.reducer;