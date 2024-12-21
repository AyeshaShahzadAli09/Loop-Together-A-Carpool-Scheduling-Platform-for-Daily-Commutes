import { Outlet } from "react-router-dom";
import Map from "./Map"

const AppLayout = () =>{
    return(  
            <div className="flex flex-col md:flex-row h-screen">       
                <div className="md:w-1/2 p-4">   {/* Left Section - Ride Form */}
                <Outlet/> {/* Renders child routes */}
                </div> 
            <div className="md:w-1/2">   {/* Right Section - Map */}
                <Map />
            </div> 
        </div>
    )
}

export default AppLayout;