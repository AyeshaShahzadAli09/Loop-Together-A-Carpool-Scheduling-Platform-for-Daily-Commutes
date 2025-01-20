// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Button from '../../ui/Button';
import { FaRegUserCircle } from "react-icons/fa";
       
const FindDriver = () =>{
  const commutes = useSelector((state) => state.offerRide.commutes);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
      setExpandedIndex(expandedIndex === index ? null : index); // Toggle accordion
  };
 
//   const navigate = useNavigate();

const handleRequestAccepted = (ridesId) => {
  console.log(`Accepted rides ${ridesId}`);
  // Implement logic here
};
  return (
    <div className="container mx-auto p-2">
    <h2 className="text-2xl font-bold mb-4 text-center">Passengers Looking for a Ride</h2>
    <div className="space-y-2">
        {commutes.map((ride, index) => (
            <div
                key={index}
                className="p-4 border-[1px] border-teal-900 rounded-md bg-white shadow-sm">
                <div className="flex items-start space-x-4">
                    {/* Image on the Left */}
                    {/* <img src="https://via.placeholder.com/100" alt="User" className="w-24 h-24 rounded-md" /> */}
                    <FaRegUserCircle className="text-[6.25rem] mt-5 md:mr-2" />
                    {/* Info Beside Image */}
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-2xl">{ride.name}</h3>
                        {/* Locations, Date, Time, and Price */}
                        <p className="text-stone-800 font-semibold">{ride.departureLocation} to {ride.destinationLocation}</p>
                        <p className="text-stone-800 font-semibold">{ride.departureDate} at {ride.departureTime}</p>
                        <p className="text-stone-800 font-semibold">Price: <span className="text-amber-400 font-semibold">Rs. {ride.pricePerSeat}</span></p>
                        
                        {/* View Details Button */}
                        <Button
                            onClick={() => handleToggle(index)}
                            type="linkBtn">
                            {expandedIndex === index ? "Hide Details" : "View Details"}
                        </Button>

                        {/* Accordion for Additional Details */}
                        {expandedIndex === index && (
                            <div className="flex md:justify-between md:mt-0.5 flex-col">
                                <p><strong>Gender:</strong> {ride.gender}</p>
                                {ride.additionalNotes &&
                                <p><strong>Additional Notes:</strong> {ride.additionalNotes}</p> }
                            </div>
                        )}
                    </div>
                     <div className="flex flex-col md:flex-row mt-14">
                     <Button type="smallRequest" onClick={handleRequestAccepted}>Request</Button>
                     
                        </div>
                </div>
            </div>
        ))}
    </div>
</div>
);
};

export default FindDriver;