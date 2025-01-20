// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
// https://api.opencagedata.com/geocode/v1/json?q=52.3877830%2C9.7334394&key=YOUR-API-KEY
import { useDispatch} from "react-redux";
import { addCommute } from "./offerRideSlice";
import {  useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { useUrlPosition } from "../../hooks/useUrlPosition";
import { toast } from "react-hot-toast";
import { validateFormData } from "../../utils/helper";
import Button from "../../ui/Button"

const initialState = {
  // id: driverId,
  name: '',
  departureLocation: '',
  destinationLocation: '',
  departureDate: ' ', 
  departureTime: '',
  coordinates: { 
    departure: [51.505, -0.09], // Default values for markers
    destination: [51.505, -0.09]
  },
  vehicleType: '',
  availableSeats: '',
  gender: 'Male',
  pricePerSeat: 0,
  additionalNotes: '',
}

// Get today's date in 'YYYY-MM-DD' format
const today = new Date().toISOString().split('T')[0];
// console.log(today)

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const OfferRide = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mapLat, mapLng] = useUrlPosition();
  const [rideData, setRideData] = useState(initialState);
//  console.log(rideDetails)
  const[isLoadingGeoCoding , setIsLoadingGeoCoding] = useState(false);
  const[locationName , setLocationName] = useState("");
  const[geoCodingError, setGeoCodingError] = useState("");

  useEffect(function(){
    if(!mapLat && !mapLng) return;
    async function fetchLocationData(){
      try{
        setIsLoadingGeoCoding(true);
        setGeoCodingError(""); //to reset the error
        const response = await fetch(`${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`);
        const data = await response.json();
        //console.log(data);
        if(!data.countryCode) throw new Error("That doesn't seem to be a country.Click somewhere else");
        // setLocationName
        setLocationName(data.city || data.locality || "");
      }catch(err)
      {
        //console.log(err);
        setGeoCodingError(err.message);
      }finally{
        setIsLoadingGeoCoding(false)
      }
    }
    fetchLocationData(); // call the func
    },[mapLat,mapLng])
    
  const handleChange = (e) => {
      const { name, value } = e.target;
    
  // ensure they are non-negative
  if ((name === "pricePerSeat" || name === "availableSeats") && value < 0) {
    setRideData((prevData) => ({
      ...prevData,
      [name]: 0,  // Set it back to 0 if the value is negative
    }));
  } else {
      setRideData((prevData) => ({
      ...prevData,
      [name]: value
      }));
    }
  };

      function handleSubmit(e) //handle validation and dispatch actions
      {
        e.preventDefault();
        console.log('Ride Details:', rideData);
         // Validate if coordinates are set
    // if (!rideData.coordinates.departure || !rideData.coordinates.destination) {
    //   alert("Please make sure both departure and destination locations are set.");
    //   return;
    // }

    const errors = validateFormData(rideData);

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error); // Show error notifications
      });
      return;
    }
    
        dispatch(addCommute(rideData));//Dispatch the addUser action with the rideDetails data
        toast.success("Form submitted successfully!");

        // Submit ride details to server or handle accordingly
        setRideData(initialState);      
        navigate("/app/findPassenger");
      };

//       if(isLoadingGeoCoding) return <Spinner/>
// if(!lat && !lng) return <Message message="Start by clicking somewhere on the map"/>
// if(geoCodingError) return <Message message={geoCodingError}/>

    return (
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-3 text-center dark:text-white">Offer a Ride</h2>
            <form onSubmit={handleSubmit} className="space-y-4">  
        <div>     {/* Name */}
          <label className="ride-form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={rideData.name}
            onChange={handleChange}
            required
            className="ride-form-input"
          />
        </div>

        {/* Departure & Destination */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="ride-form-label">Departure Location:</label>
            <input
              type="text"
              name="departureLocation"
              value={rideData.departureLocation}
              onChange={handleChange}
              required
              className="ride-form-input"
            />
            {/* {loading && <p>Loading...</p> */}
          </div>
          <div className="flex-1">
            <label className="ride-form-label">Destination Location:</label>
            <input
              type="text"
              name="destinationLocation"
              value={rideData.destinationLocation} 
              onChange={handleChange}
              required
              className="ride-form-input"
            />
            {/* {loading && <p>Loading...</p>}*/}
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="ride-form-label">Departure Date:</label>
            <input
              type="date"
              name="departureDate"
              defaultValue={rideData.departureDate}
              onChange={handleChange}
              min={today}  // Set minimum to today's date
              required
              className="ride-form-input"
            />
          </div>
          <div className="flex-1 mt-2">
            <label className="ride-form-label">Departure Time:</label>
            <input
              type="time"
              name="departureTime"
              value={rideData.departureTime}
              onChange={handleChange}
              required
              className="ride-form-input"
            />
          </div>
        </div>

        {/* Available Seats, Gender & Price per Seat */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="ride-form-label">Available Seats:</label>
            <input
              type="number"
              name="availableSeats"
              value={rideData.availableSeats}
              onChange={handleChange}
              required
              className="ride-form-input"
            />
          </div>
          <div className="flex-1">
            <label className="ride-form-label">Preferred Gender:</label>
            <select
              name="gender"
              onChange={handleChange}
              className="ride-form-input"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="Any">Any</option>
            </select>
          </div>
        </div>

        {/* Vehicle Type and price per seat*/}
        <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="flex-1">
            <label className="ride-form-label">Price per Seat:</label>
            <input
              type="number"
              name="pricePerSeat"
              value={rideData.pricePerSeat}
              onChange={handleChange}
              required
              className="ride-form-input"
            />
          </div>
        <div className="flex-1">
        <div>
          <label className="ride-form-label">Vehicle Type:</label>
          <input
            type="text"
            name="vehicleType"
            value={rideData.vehicleType}
            onChange={handleChange}
            required
            className="ride-form-input"
          />
        </div>
        </div>
              </div>
        {/* Additional Notes */}
        <div>
          <label className="ride-form-label">Additional Notes:</label>
          <textarea
            name="additionalNotes"
            value={rideData.additionalNotes}
            onChange={handleChange}
            className="ride-form-input"
          />
        </div>
              {/* Submit Button */}
              <div className="text-center ">
                <Button type="primary">Offer Ride</Button> 
              </div>
      </form>
        </div>
            )
        }
export default OfferRide;