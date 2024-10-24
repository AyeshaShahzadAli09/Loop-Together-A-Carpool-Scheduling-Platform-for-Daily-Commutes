import { useDispatch, useSelector } from "react-redux";
import { setAdditionalNotes, setAvailableSeats, setDepartureDate, setDepartureLocation, setDepartureTime, setDestinationLocation, setPrice , setVehicleType } from "./rideSlice";
import { validateAvailableSeats, validatePricePerSeat } from "../../utils/helper";
import {useState } from "react";

const OfferRide = () => {
  const rideDetails = useSelector((state)=>state.ride);
  const [error,setError] = useState("");
//  console.log(rideDetails)
  const dispatch = useDispatch();

      function handleSubmit(e)
      {
        e.preventDefault();
        console.log('Ride Details:', rideDetails);
        // Submit ride details to server or handle accordingly
      };
      function handleAvailableSeats(e)
      {
        const seats = e.target.value; 
           if(validateAvailableSeats(seats)) dispatch(setAvailableSeats(seats))
            else 
          {
            setError("Error Occurred!! Enter correct number");
            return error;
          }
      }

      function handlePricePerSeat(e)
      {
        const price = e.target.value;
        if(validatePricePerSeat(price)) dispatch(setPrice(price))
          //   else {
          // setError("Error Occurred!! Enter correct Amount");
          // return error;
          //   }
      }

          return (
            <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Offer a Ride</h2>
      <form onSubmit={handleSubmit} className="space-y-6  ">
        {/* Departure & Destination */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Departure Location:</label>
            <input
              type="text"
              name="departureLocation"
              defaultValue={rideDetails.departureLocation || ""}
              onChange={(e)=>dispatch(setDepartureLocation(e.target.value))}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Destination Location:</label>
            <input
              type="text"
              name="destinationLocation"
              defaultValue={rideDetails.destinationLocation || ""}
              onChange={(e)=>dispatch(setDestinationLocation(e.target.value))}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Departure Date:</label>
            <input
              type="date"
              name="departureDate"
              defaultValue={rideDetails.departureDate}
              onChange={(e)=>dispatch(setDepartureDate(e.target.value))}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 mt-2">
            <label className="block text-sm font-medium text-gray-700">Departure Time:</label>
            <input
              type="time"
              name="departureTime"
              value={rideDetails.departureTime}
              onChange={(e)=>dispatch(setDepartureTime(e.target.value))}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Available Seats */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Available Seats:</label>
          <input
            type="number"
            name="availableSeats"
            value={rideDetails.availableSeats || ""}
            onChange={handleAvailableSeats}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           {/* {error &&(
                    <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">{error}</p>
                )} */}
        </div>
               {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Type:</label>
            <input
              type="text"
              name="vehicleType"
              value={rideDetails.vehicleType || ""}
              onChange={(e) =>dispatch(setVehicleType(e.target.value))}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        {/* Price per Seat */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price per Seat:</label>
          <input
            type="number"
            name="pricePerSeat"
            value={rideDetails.pricePerSeat || ""}
            onChange={handlePricePerSeat}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            {/* {error &&(
                    <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700 duration-300">{error}</p>
                )} */}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Notes:</label>
          <textarea
            name="additionalNotes"
            value={rideDetails.additionalNotes || ""}
            onChange={(e)=>dispatch(setAdditionalNotes(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Offer Ride
          </button>
        </div>
      </form>
    </div>
            )
        }
export default OfferRide;