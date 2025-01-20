import FormHome from "./FormHome";
import HomePageAnimation from "./HomePageAnimation";

const Community = () =>{
    return(
        <div className="flex min-h-[75vh]"> 
         {/* Right Section */} 
         <div className="w-full p-4 relative flex-grow flex-1 hidden md:block "> {/* flex-grow allows it to fill available space */}
          <HomePageAnimation />
            <div className="absolute inset-0 flex flex-col justify-start m-3 p-2 bg-black bg-opacity-10 rounded-lg dark:bg-stone-500 dark:bg-opacity-15 dark:rounded-lg">
              <p className="text-lg text-teal-900 font-semibold">
                Reduce expenses with our Carpooling Platform.
                </p>
            </div>
        </div>
        {/* Left Section */}
        <div className="w-full md:w-1/3 p-4 flex-shrink-0 flex flex-col"> 
          <FormHome className="flex-grow" /> {/* Make FormHome fill the available height */}
        </div>
      </div>
    )
}

export default Community;