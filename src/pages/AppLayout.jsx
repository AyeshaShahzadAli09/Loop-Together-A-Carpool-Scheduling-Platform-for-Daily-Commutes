import FindRide from "../features/Ride/FindRide"
// import OfferRide from "../features/Ride/OfferRide"
import Map from "../features/Ride/Map"
const AppLayout = () =>{
    return(
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left Section - FindRide Form */}
            <div className="md:w-1/2 p-4">
            <FindRide />
            </div>
            {/* Right Section - Map */}
            <div className="md:w-1/2 p-4 bg-gray-100">
                <Map />
            </div>
        </div>
    
    )
}

export default AppLayout;