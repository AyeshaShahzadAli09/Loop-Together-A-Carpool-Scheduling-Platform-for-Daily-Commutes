const MainDisplay = () =>{
    return(
        <div className="flex flex-col md:flex-row items-center justify-between p-8 min-h-[75vh] bg-gray-100 dark:bg-soft-black dark:text-white">
                {/* Text Section */}
      <div className="flex-1 md:pr-12 mb-8 md:mb-0 text-center md:text-left">
        <h1 className="font-playfair text-xl md:text-5xl font-bold mb-4 capitalize">
        Make awesome Travel easy and Pocket-Friendly
        </h1>
        <h1 className="font-dancing text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-emerald-400 lowercase">Loop Together</h1>
        <p className="text-lg text-gray-900 dark:text-white">
        Emabark on a  shared journey, offer ride for a seamless carpooling experience.
        </p>
      </div>
      
      {/* Image- Section */}
      <div className="flex-1">
        <img
          src="public\image3.avif"
          alt="Placeholder"
          className="w-full h-96 rounded-lg"
        />
      </div>
    </div>
    )
}

export default MainDisplay;