import { scheduledCarpools } from "./scheduledCarpools";
import Logo from "../../ui/Logo";
import { IoHome ,IoPersonSharp ,IoInvertModeOutline ,IoLogOut } from "react-icons/io5";
import { PiCarProfileBold } from "react-icons/pi";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Dashboard = () =>{
  const navigate = useNavigate();

  const commutes = useSelector((state) => state.findRide.commutes);
  
  const handleChat = (rideId) => {
    navigate(`/chat/${rideId}`);
  };

  const handleCancelRide = (rideId, rideDate) => {
    alert(`Ride on ${rideDate} has been canceled by you.`);
    //setRides(rides.filter((ride) => ride.id !== rideId)); // Update state to remove canceled ride
  };
  
    return(
          <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="lg:w-1/5 bg-teal-900 text-white p-6 flex flex-col">
        {/* Logo and Tagline */}
        <div className="mb-10">
          {/* <img src="/logo.png" alt="Logo" className="w-16 mx-auto mb-2" /> */}
          <Logo/>
          <h1 className="text-2xl font-bold">Loop Together</h1>
          <p className="text-sm italic mt-1 capitalize">Ride together, save together</p>
        </div>

        {/* Navigation Links */}
        <nav>
        <ul className="flex flex-col space-y-4">
      {/* Home */}
      <li>
        <NavLink
          to="/"
          className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-stone-100 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white active:bg-gray-100 active:text-gray-900 dark:active:bg-gray-800 dark:active:text-white"
        >
          <IoHome className="w-6 h-6" />
          <span>Home</span>
        </NavLink>
      </li>

        {/* Scheduled Carpools */}
        <li>
        <NavLink
          to="/scheduled-carpools"
          className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-stone-100 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white active:bg-gray-100 active:text-gray-900 dark:active:bg-gray-800 dark:active:text-white"
        >
          <PiCarProfileBold className="w-6 h-6" />
          <span>Scheduled Carpools</span>
        </NavLink>
      </li>
      
      {/* Profile */}
      <li>
        <NavLink
          to="/profile"
          className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-stone-100 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white active:bg-gray-100 active:text-gray-900 dark:active:bg-gray-800 dark:active:text-white"
        >
          <IoPersonSharp className="w-6 h-6" />
          <span>Profile</span>
        </NavLink>
      </li>

      {/* Switch Mode */}
      <li>
        <NavLink
          to="/switch-mode"
          className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-stone-100 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white active:bg-gray-100 active:text-gray-900 dark:active:bg-gray-800 dark:active:text-white"
        >
          <IoInvertModeOutline className="w-6 h-6" />
          <span>Switch Mode</span>
        </NavLink>
      </li>

      {/* Logout */}
      <li>
        <NavLink
          to="/logout"
          className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-stone-100 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white active:bg-gray-100 active:text-gray-900 dark:active:bg-gray-800 dark:active:text-white"
        >
            <IoLogOut className="w-6 h-6"/>
          <span>Logout</span>
        </NavLink>
      </li>
    </ul>
        </nav>
      </div>

      {/* Right Content */}
      <div className="lg:w-3/4 w-full  p-4 lg:p-6">
        {/* Header */}
        <h1 className="text-xl lg:text-2xl font-bold text-teal-900 mb-4 lg:mb-6">Scheduled Carpools</h1>

      {/* Group rides by date */}
{scheduledCarpools.length ? (
  <div className="p-4 rounded shadow overflow-auto max-h-screen">
    {/* Grouping rides by date */}
    {Object.entries(
      scheduledCarpools.reduce((groups, ride) => {
        (groups[ride.date] = groups[ride.date] || []).push(ride);
        return groups;
      }, {})
    ).map(([date, rides]) => (
      <div key={date}>
        {/* Left Date Section */}
        <div className="flex items-start space-x-6 py-4">
          <div className="text-center flex-shrink-0">
            <p className="font-bold text-teal-700">{rides[0].day}</p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>

          {/* Ride Details Section */}
          <div className="flex-1 space-y-4">
            {rides.map((ride, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded shadow border border-emerald-500">
                {/* Ride Information */}
                <p className="text-gray-700 flex-1">
                  Pick <span className="font-semibold">{ride.driverName}</span> from{" "}
                  <span className="font-semibold">{ride.departureLocation}</span> to{" "}
                  <span className="font-semibold">{ride.destination}</span> at{" "}
                  <span className="font-semibold">{ride.time}</span> in{" "}
                  <span className="font-semibold">{ride.price} PKR</span>.
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    className="text-teal-600 font-bold hover:underline"
                    onClick={() => handleChat(ride.id)}
                  >
                    Chat
                  </button>
                  <button
                    className="text-red-600 font-bold hover:underline"
                    onClick={() => handleCancelRide(ride.id, ride.date)}
                  >
                    Cancel Ride
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500 text-center">No rides scheduled.</p>
)}
        </div>
      </div>
    )
}

export default Dashboard;