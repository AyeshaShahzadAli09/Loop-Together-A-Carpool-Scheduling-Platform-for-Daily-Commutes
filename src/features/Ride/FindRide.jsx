import { useDispatch } from "react-redux";
import { addCommute} from "./findRideSlice";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";
import {useState } from "react";

const initialState = {
  // userId: id,
  name: '',
  departureLocation: '',
  destinationLocation: '',
  departureDate: '',
  departureTime: '',
  gender: 'Male',
  additionalNotes: ''
}
// Get today's date in 'YYYY-MM-DD' format
const today = new Date().toISOString().split('T')[0];
// console.log(today
const FindRide = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rideData, setRideData] = useState(initialState);
  // const [error,setError] = useState("");
  
const handleChange = (e) => {
  const { name, value } = e.target;
  setRideData((prevData) => ({
      ...prevData,
      [name]: value
  }));
};
      function handleSubmit(e)
      {
        e.preventDefault();
        console.log('Ride Details:', rideData);
        dispatch(addCommute(rideData));
        setRideData({initialState});      
        
        navigate("/app/findDriver");
      };
    return( 
      <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-3 text-center">Find a Ride</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
  {/* Name */}
  <div>
    <label className="ride-form-label">Name:</label>
    <input
      type="text"
      name="name"
      value={rideData.name}
      // onChange={(e) => dispatch(setName(e.target.value))}
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
        defaultValue={rideData.departureLocation}
        // onChange={(e) => dispatch(setDepartureLocation(e.target.value))}
        onChange={handleChange}
        required
        className="ride-form-input"
      />
    </div>
    <div className="flex-1">
      <label className="ride-form-label">Destination Location:</label>
      <input
        type="text"
        name="destinationLocation"
        defaultValue={rideData.destinationLocation}
        // onChange={(e) => dispatch(setDestinationLocation(e.target.value))}
        onChange={handleChange}
        required
        className="ride-form-input"
      />
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
        // onChange={(e) => dispatch(setDepartureDate(e.target.value))}
        onChange={handleChange}
        min={today} // Set minimum to today's date
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
        // onChange={(e) => dispatch(setDepartureTime(e.target.value))}
        onChange={handleChange}
        required
        className="ride-form-input"
      />
    </div>
  </div>

  {/* Available Seats, Gender & Price per Seat */}
  <div className="flex flex-col md:flex-row md:space-x-4">
    <div className="flex-1">
      <label className="ride-form-label">Preferred Gender:</label>
      <select
        name="gender"
        // onChange={(e) => dispatch(setGender(e.target.value))}
        onChange={handleChange}
        className="ride-form-input"
      >
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="Any">Any</option>
      </select>
    </div> 
  </div>

  {/* Additional Notes */}
  <div>
    <label className="ride-form-label">Additional Notes:</label>
    <textarea
      name="additionalNotes"
      value={rideData.additionalNotes}
      // onChange={(e) => dispatch(setAdditionalNotes(e.target.value))}
      onChange={handleChange}
      className="ride-form-input"
    />
  </div>
        {/* Submit Button */}
        <div className="text-center ">
          <Button type="primary">Find Ride</Button>
        </div>
</form>
</div>
    )
}
export default FindRide;