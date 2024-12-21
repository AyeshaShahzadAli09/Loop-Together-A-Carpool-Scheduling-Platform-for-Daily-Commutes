// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Button from '../../ui/Button';
import { FaRegUserCircle } from "react-icons/fa";


const FindPassenger = () =>{
    const commutes = useSelector((state) => state.findRide.commutes);
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleToggle = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index); // Toggle accordion
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>★</span>
        ));
    };

//   const navigate = useNavigate();

// const handleAccept = (ridesId) => {
//   console.log(`Accepted rides ${ridesId}`);
//   // Implement accept logic here
// };

// const handleDecline = (ridesId) => {
//   console.log(`Declined rides ${ridesId}`);
//   // Implement decline logic here
// };
  return (
    <div className="container mx-auto p-2">
    <h2 className="text-2xl font-bold mb-4 text-center">Drivers Looking for a Passengers</h2>
    <div className="space-y-2">
        {commutes.map((ride, index) => (
            <div
                key={index}
                className="p-4 border-[1px] border-teal-900 rounded-md bg-white shadow-sm">
                <div className="flex items-start space-x-4">
                    {/* Image on the Left */}
                    {/* <img src="https://via.placeholder.com/100" alt="User" className="w-24 h-24 rounded-md" /> */}
                    <FaRegUserCircle className="text-[6.25rem] mt-6 md:mr-2" />
                    {/* Info Beside Image */}
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-2xl">{ride.name}</h3>
                        {/* Locations, Date, Time, and Price */}
                        <p className="text-stone-800 font-semibold">{ride.departureLocation} to {ride.destinationLocation}</p>
                        <p className="text-stone-800 font-semibold">{ride.departureDate} at {ride.departureTime}</p>
                        <p className="text-stone-800 font-semibold">Price: <span className="text-amber-400 font-semibold">Rs. {ride.pricePerSeat}</span></p>

                        <div className="flex items-center space-x-2">
                            {renderStars(4)} {/* Placeholder rating */}
                            <span className="text-gray-600">(4/5)</span>
                        </div>
                        
                        {/* View Details Button */}
                        <Button
                            onClick={() => handleToggle(index)}
                            type="linkBtn">
                            {expandedIndex === index ? "Hide Details" : "View Details"}
                        </Button>

                        {/* Accordion for Additional Details */}
                        {expandedIndex === index && (
                          <>
                            <div className="flex md:justify-between md:mt-0.5 flex-col">
                                <p><strong>Available Seats:</strong> {ride.availableSeats}</p>
                                <p><strong>Gender:</strong> {ride.gender}</p>
                            </div>
                            <div className="flex md:justify-between md:mt-0.5 flex-col">
                              {ride.additionalNotes &&
                                <p><strong>Additional Notes:</strong> {ride.additionalNotes}</p> }
                                <p><strong>Vehicle Type:</strong> {ride.vehicleType}</p>  
                            </div>
                            </>
                        )}
                    </div>
                     {/* Accept/Decline Buttons on the Right */}
                     <div className="flex flex-col md:flex-row mt-14">
                     <Button type="smallAccept" onClick={() => console.log("Accepted")}>Accept</Button>
                     <Button type="smallDecline" onClick={() => console.log("Declined")}>Decline</Button>
                        </div>
                </div>
            </div>
        ))}
    </div>
</div>
);
};
export default FindPassenger;

// FindPassenger page that displays a list of ridess looking for a ride, with each rides's details and a "View" button
// 1. Mock Data: For now, I’ll use an example list of ridess who are finding a ride. This data could come from an API or database in a real-world scenario.
// Card Layout: Each rides’s information is displayed in a card-like div with a border, padding, and shadow.
// Details Display:
// Name is shown as a bold heading.
// Location is formatted as “Departure to Destination.”
// Date and Time are displayed on the last line.
// Buttons: "Accept" and "Decline" buttons are on the right side, each with distinctive colors and a hover effect.




