import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import { FaCarSide } from "react-icons/fa";
import { FaCaravan } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";

const ExploreCards = () =>{
    return(
        <section>
            <h1 className="tracking-widest uppercase font-bold text-center text-4xl font-mono my-6">Explore</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {/* <!-- Card 1 --> */}
        <div className="group div-explore-card hover:bg-teal-900">
            <h2 className="h2-explore-card">
            <FaCarSide className="text-4xl sm:text-5xl md:text-6xl text-teal-900 transition-transform duration-300 group-hover:text-white" />
            <span className="text-lg">Skilled Drivers</span>
            </h2>
            <p className="p-explore-card">Accomplished drivers contribute to a positive and enjoyable atmosphere</p>
        </div>

        {/* <!-- Card 2 --> */}
        <div className="group div-explore-card hover:bg-teal-900">
        <h2 className="h2-explore-card">
        <HiGlobeAsiaAustralia className="text-4xl sm:text-5xl md:text-6xl text-teal-900 transition-transform duration-300 group-hover:text-white" />
        <span className="text-lg">Online Booking</span>
        </h2>
        <p className="p-explore-card">Ensure your seat by scheduling your carpooling journey online</p>
        </div>

        {/* <!-- Card 3 --> */}
        <div className="group div-explore-card hover:bg-teal-900">
        <h2 className="h2-explore-card">
        <FaCaravan className="text-4xl sm:text-5xl md:text-6xl text-teal-900 transition-transform duration-300 group-hover:text-white" />
        <span className="text-lg">Daily Commute</span>
        </h2>
            <p className="p-explore-card">Its convenient, economical, and contributes to a greener planet</p>
        </div>

        {/* <!-- Card 4 --> */}
        <div className="group div-explore-card hover:bg-teal-900">
        <h2 className="h2-explore-card">
        <FaHandshake className="text-4xl sm:text-5xl md:text-6xl text-teal-900 transition-transform duration-300 group-hover:text-white" />
        <span className="text-lg">Agreement</span>
        </h2>
        <p className="p-explore-card">Rider commits to maintaining cleanliness and order in the vehicle</p>
        </div>
        </div>
        </section>
    )
}

export default ExploreCards;