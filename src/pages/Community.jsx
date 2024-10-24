import { Link } from "react-router-dom";
import FormHome from "../ui/FormHome";

const Community = () =>{
    return(
        <div className="flex min-h-[75vh]"> {/* Ensures both sides have the same minimum height */}
         {/* Right Section */}
         <div className="w-full md:w-2/3 p-4 relative flex-grow"> {/* flex-grow allows it to fill available space */}
            {/* goes to a community page */}
          <Link to="/community" className="block relative h-full"> {/* h-full makes link container stretch */}
            <img 
              src="public/Comunity.jpg" 
              alt="Carpooling Image" 
              className="w-full h-full object-cover rounded-lg border border-blue-300 hover:shadow-2xl"
            />
            <div className="absolute inset-0 flex flex-col justify-start p-4 bg-black bg-opacity-20 rounded-lg">
              <p className="text-base text-white">
                Reduce expenses with our Carpooling Platform. Join our Community
              </p>
              <h1 className="text-3xl font-bold text-teal-400">Join Our Community</h1>
            </div>
          </Link>
        </div>
        {/* Left Section */}
        <div className="w-full md:w-1/3 p-4 flex-shrink-0 flex flex-col"> {/* Flex container to allow content stacking */}
          <FormHome className="flex-grow" /> {/* Make FormHome fill the available height */}
        </div>
      
       
      </div>
    )
}

export default Community;