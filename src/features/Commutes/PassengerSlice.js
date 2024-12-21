import { createSlice } from "@reduxjs/toolkit"

const initialState = {
        image: '',
        name: '',
        departureLocation: '',
        destinationLocation: '',
        departureDate: '',
        departureTime: '',
    }
const commuteSlice = createSlice({
    name:'findingCommutes',
    initialState,
    reducers:{
        // setImage(state, action){

        // },
        setName(state, action)
        {
            //payload  = name of user (Login)
            state.departureLocation = action.payload;
        },
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
    }
})

// Export actions
export const {setDepartureDate, setDepartureLocation,setDepartureTime,setDestinationLocation,setName } = commuteSlice.actions;
// Export reducer
export default commuteSlice.reducer;