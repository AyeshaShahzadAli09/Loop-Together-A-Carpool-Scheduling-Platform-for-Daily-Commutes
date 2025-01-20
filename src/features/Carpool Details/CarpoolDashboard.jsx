import { useNavigate } from "react-router-dom";
import PageNav from "../../pages/PageNav";
import Footer from "../../ui/Footer";
import rides from "./CarpoolList";
import { useCallback } from "react";
import Button from "../../ui/Button";

const CarpoolDashboard = () => {
  const navigate = useNavigate();
 
  const  handleStartRide = useCallback((ride) => {
    console.log(`Start all carpools on ${ride}`);
    navigate(`/app/currentCarpool/`, { state: { ride } });  // Pass ride data as state
    // navigate(`/app/currentCarpool/`)  //replace rideid with userid
  }, []);

  const handleCancelRide = useCallback((rideDate) => {
    console.log(`Cancel all carpools on ${rideDate}`);
  }, []);

  const handleChat = useCallback((rideId) => {
    console.log(`Initiate chat for carpool ID: ${rideId}`);
    navigate(`/app/chat/`)  //replace rideid with userid
  }, []);

  const groupedRides = rides.reduce((groups, ride) => {
    (groups[ride.date] = groups[ride.date] || []).push(ride);
    return groups;
  }, {});

  return (
    <main className="bg-slate-50 dark:bg-dark-gray min-h-screen flex flex-col">
    <PageNav />
    <section className="flex-grow m-10">
      <h1 className="capitalize text-2xl font-bold dark:text-white">
        {rides.length ? "Scheduled Carpools" : "No Scheduled Carpools"}
      </h1>
      {rides.length ? (
        <div className="p-4 rounded shadow mt-6 dark:bg-soft-black dark:text-white">
          {Object.entries(groupedRides).map(([date, rides]) => (
            <div key={date} className="py-4">
              {/* Group Header */}
              <div className="flex items-start space-x-6">
                <div className="text-center flex-shrink-0">
                  <p className="font-bold text-teal-700 dark:text-teal-500">{rides[0].day}</p>
                  <p className="text-sm text-gray-500 dark:text-teal-500">{date}</p>
                </div>
  
                {/* Ride Details Section */}
                <div className="flex-1 space-y-4">
                  {rides.map((ride) => (
                    <div
                      key={ride.id}
                      className="flex items-center justify-between bg-gray-100 p-6 rounded shadow dark:bg-deep-navy dark:text-white"
                    >
                      <p className="text-gray-700 flex-1 dark:text-gray-300">
                        Pick <span className="font-semibold">{ride.driverName}</span> from{" "}
                        <span className="font-semibold">{ride.departureLocation}</span> to{" "}
                        <span className="font-semibold">{ride.destination}</span> at{" "}
                        <span className="font-semibold">{ride.time}</span> in{" "}
                        <span className="font-semibold">{ride.price} PKR</span>.
                      </p>
                      <Button type="link" onClick={() => handleChat(ride.id)}>Chat</Button>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Cancel Ride Button */}
              <div className="text-right mt-2">
              <Button type="link" onClick={() => handleStartRide(date)}>Start Ride</Button>
                <Button type="linkRed" onClick={() => handleCancelRide(date)} >Cancel Ride</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-6 dark:text-gray-400">No rides scheduled at the moment. Check back later!</p>
      )}
    </section>
    <Footer />
  </main>
  
  );
};

export default CarpoolDashboard;
