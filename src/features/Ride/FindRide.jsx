import { useDispatch } from "react-redux";
import { addCommute} from "./findRideSlice";
import { useNavigate } from "react-router-dom";
import {useState } from "react";
import { toast } from "react-hot-toast";
import { validateFormData } from "../../utils/helper";
import Button from "../../ui/Button";

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

        const errors = validateFormData(rideData, true);

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error); // Show error notifications
      });
      return;
    }
        dispatch(addCommute(rideData));
        toast.success("Form submitted successfully!");
        setRideData(initialState);      
        navigate("/app/findDriver");
      };
    return( 
      <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-3 text-center">Find a Ride</h2>
        <form onSubmit={handleSubmit} className="space-y-4"> 
        <div>   {/* Name */}
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
              defaultValue={rideData.departureLocation}
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
              onChange={handleChange}
              required
              className="ride-form-input"
            />
          </div>
        </div>

        {/* Preferred Gender  */}
        <div className="flex flex-col md:flex-row md:space-x-4">
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
                <Button type="primary">Find Ride</Button>
              </div>
      </form>
      </div>
    )
}
export default FindRide;