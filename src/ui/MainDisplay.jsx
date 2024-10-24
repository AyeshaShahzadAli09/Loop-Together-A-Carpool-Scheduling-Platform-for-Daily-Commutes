const MainDisplay = () =>{
    return(
        <div className="flex flex-col md:flex-row items-center justify-between p-8 min-h-[75vh] bg-gray-100">
                {/* Text Section */}
      <div className="flex-1 md:pr-12 mb-8 md:mb-0 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
        Make awesome Travel easy and Pocket-Friendly
        </h1>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-emerald-400 uppercase ">Loop Together</h1>
        <p className="text-lg text-gray-600">
        Emabark on a  shared journey , offer ride for a seamless carooling experience.
        </p>
      </div>
      
      {/* Image Section */}
      <div className="flex-1">
        <img
          src="public\HomeMain.PNG"
          alt="Placeholder"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
    )
}

export default MainDisplay;