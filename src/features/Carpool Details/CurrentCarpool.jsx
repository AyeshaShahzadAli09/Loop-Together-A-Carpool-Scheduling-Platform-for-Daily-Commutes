import { CgEditBlackPoint } from "react-icons/cg";
import { IoLogoWechat } from "react-icons/io5";
import rides from "./CarpoolList";
import Button from "../../ui/Button";

const CurrentCarpool = () => {

  return (
    <div className="dark:bg-dark-gray  flex flex-col">
      {/* Driver Arrival Info */}
      <div className="p-2 text-center bg-teal-700 text-white rounded">
        <p className="text-xl font-semibold">Driver arriving in 3 min</p>
      </div>
      {/* Car Info */}
      <div className="p-2 mt-2">
        <p className="text-base font-semibold">Car <span className="text-slate-500 dark:text-slate-200">
        (vehicle type and number)</span></p>
      </div>
      {/* Driver Info (Name with Image) */}
      <div className="flex items-center justify-center space-x-4 p-4">
        <img src={rides.Image} alt={rides.Name} className="w-16 h-16 rounded-full mr-4" />
          <p className="text-xl font-semibold">{rides.name}</p>
          {/* <!-- Chat Icon and Text --> */}
          <div className="flex flex-col items-center text-center">
            <Button type="chatBtn" ><IoLogoWechat /></Button>
            <span className="text-lg font-semibold text-teal-700 mt-2">Chat</span>
          </div>   
        </div>
      {/* Additional Notes (if any) */}
      <div className="flex justify-between p-4 bg-gray-100 rounded shadow mt-4">
        <p className="text-base font-semibold dark:text-dark-gray">Any Notes ? <span className="text-slate-500">
          Additional Notes Text</span></p>
            </div>
      {/* Payment Info */}
      <div className="flex justify-between p-4 bg-gray-100 rounded shadow mt-4">
        <p className="text-base font-semibold dark:text-dark-gray">Price Per Seat: PKR 570  <span className="text-slate-500">Cash</span></p>
      </div>
      {/* Route Info */}
      <div className="p-4 bg-gray-100 rounded shadow mt-4">
          <p className="text-base font-semibold text-slate-800 mb-2">Your Current Trip</p>
      <div className="flex items-center space-x-2 text-lg dark:text-dark-gray">
          <CgEditBlackPoint /><span>Departure Location</span>
      </div>
      <div className="flex items-center space-x-2 text-lg mt-2 dark:text-dark-gray">
        <CgEditBlackPoint />
        <span>Destination Location</span>
      </div>
    </div>
      {/* Cancel Button */}
      <div className="flex justify-center p-5">
        <Button type="cancelRide">Cancel</Button>
      </div>
    </div>
  );
};

export default CurrentCarpool;
