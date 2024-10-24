// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHome } from '@fortawesome/free-solid-svg-icons';
const ExploreCards = () =>{
    return(
        <section>
            <h1 className="tracking-widest uppercase font-bold text-center text-4xl font-mono my-6">Explore</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {/* <!-- Card 1 --> */}
        <div className="bg-white shadow-md rounded-lg p-6 group hover:bg-blue-400 transition duration-300 transform hover:-translate-y-2 hover:shadow-lg">
        {/* <FontAwesomeIcon icon="fa-regular fa-car" /> */}
            <h2 className="text-xl font-bold mb-2 group-hover:text-slate-50 transition-colors duration-300">Skilled Drivers</h2>
            <p className="text-gray-700  group-hover:text-slate-50 transition-colors duration-300">Accomplished drivers contribute to a positive and enjoyable atmosphere</p>
        </div>

        {/* <!-- Card 2 --> */}
        <div className="bg-white shadow-md rounded-lg p-6 group hover:bg-blue-400 transition duration-300 transform hover:-translate-y-2 hover:shadow-lg">
            <h2 className="text-xl font-bold mb-2 group-hover:text-slate-50 transition-colors duration-300">Online Booking</h2>
            <p className="text-gray-700 group-hover:text-slate-50 transition-colors duration-300">Ensure your seat by scheduling your carpooling journey online</p>
        </div>

        {/* <!-- Card 3 --> */}
        <div className="bg-white shadow-md rounded-lg p-6 group hover:bg-blue-400 transition duration-300 transform hover:-translate-y-2 hover:shadow-lg">
            <h2 className="text-xl font-bold mb-2   group-hover:text-slate-50 transition-colors duration-300">Daily Commute</h2>
            <p className="text-gray-700   group-hover:text-slate-50 transition-colors duration-300">Its convenient, economical, and contributes to a greener planet</p>
        </div>

        {/* <!-- Card 4 --> */}
        <div className="bg-white shadow-md rounded-lg p-6 group hover:bg-blue-400 transition duration-300 transform hover:-translate-y-2 hover:shadow-lg">
            <h2 className="text-xl font-bold mb-2 group-hover:text-slate-50 transition-colors duration-300">Agreement</h2>
            <p className="text-gray-700 group-hover:text-slate-50 transition-colors duration-300">Rider commits to maintaining cleanliness and order in the vehicle</p>
        </div>
        </div>
        </section>
    )
}

export default ExploreCards;