import { FaStar } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5"; 
import { BsChatSquareDotsFill } from "react-icons/bs"; 
import { FaMap } from "react-icons/fa6";
import AboutUsAnimation from "../ui/AboutUsAnimation";
import Footer from "../ui/Footer";
import PageNav from "../pages/PageNav";

const AboutUs = () => {
  return (
    <main className="bg-slate-50 dark:bg-dark-gray">
      <PageNav/>
      {/* About Section */}
      <section className="flex flex-col md:flex-row">
  <div className="mx-6 mt-11 flex-1 justify-center">
    <h2 className="text-3xl font-bold my-3 text-teal-900 dark:text-white"> About Us</h2>
    <h3 className="text-2xl font-bold my-4 text-stone-900 dark:text-white">
      Your Partner in Sustainable Commuting
    </h3>
    <p className="text-lg mb-6 text-justify text-teal-900 dark:text-white">
      At Loop Together, we’re on a mission to make daily commutes easier,
      more affordable, and eco-friendly. By connecting commuters who share
      similar routes and schedules, we provide a convenient solution that
      saves fuel, reduces traffic congestion, and cuts CO₂ emissions.
    </p>
    <p className="text-gray-800 font-semibold dark:text-white"><strong>Join us in transforming the way we commute!</strong></p>
  </div>

  {/* Slideshow Section */}
  <div className="flex-1 h-96 overflow-hidden relative  md:mt-0">
    <div className="absolute inset-0">
      <AboutUsAnimation />
            {/* <img
              src="public/clip1.jpg"
              alt="Image 1"
              className="w-full h-full object-cover absolute opacity-0 animate-slide"
              style={{ animationDelay: "0s" }}
            />
            <img
              src="public/clip2.jpg"
              alt="Image 2"
              className="w-full h-full object-cover absolute opacity-0 animate-slide"
              style={{ animationDelay: "5s" }}
            />
            <img
              src="public/clip3.jpg"
              alt="Image 3"
              className="w-full h-full object-cover absolute opacity-0 animate-slide"
              style={{ animationDelay: "10s" }}
            />
            <img
              src="public/clip4.jpg"
              alt="Image 4"
              className="w-full h-full object-cover absolute opacity-0 animate-slide"
              style={{ animationDelay: "15s" }}
            /> */}
          </div>
          </div>
      </section>

      {/* What We Do Section */}
      <section className="mx-6 my-3">
          <h3 className="text-3xl font-bold text-teal-900  dark:text-white">What We Do</h3>
          <p className="text-lg text-justify my-3 text-teal-900  mb-6 dark:text-white">
            At  <strong className="text-emerald-500">Loop Together</strong>, we simplify daily commutes by connecting
            individuals looking for convenient, cost-effective, and
            environmentally-friendly carpooling options. Our platform builds a
            community of commuters who share similar routes, allowing users to
            schedule rides, reduce travel expenses, and minimize their carbon
            footprint. By utilizing smart technology, including Google Maps for
            routing, we ensure that every ride is optimized for efficiency and
            ease. Whether you’re commuting daily or occasionally,
            <strong className="text-emerald-500"> Loop Together</strong> is your reliable partner in creating
            sustainable travel solutions, fostering connections, and making
            commutes more enjoyable.
          </p>
      </section>
      <hr />
      {/* Features Section */}
      <section className="my-10 mx-3">
        <h3 className= "text-center text-4xl font-bold mb-10 text-teal-900 dark:text-white">Our Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {/* Feature 1 */}
         <div className="group div-explore-card bg-teal-900  hover:bg-teal-800 ">
         <h5 className="h2-explore-card">
            <IoLocationSharp className="text-4xl sm:text-5xl md:text-6xl text-white transition-transform duration-300 group-hover:text-white" />
           <span className="text-lg text-white">Location-Based Matching </span></h5>
            <p className="p-explore-card text-white">Smart algorithms to connect you with people on same route.</p>
          </div>

          {/* Feature 2 */}
           <div className="group div-explore-card bg-teal-900 hover:bg-teal-800">
           <h5 className="h2-explore-card">
           <BsChatSquareDotsFill className="text-4xl sm:text-5xl md:text-6xl text-white transition-transform duration-300 group-hover:text-white"/>
           <span className="text-lg text-white">Secure Communication</span></h5>
            <p className="p-explore-card text-white">Chat securely with other commuters for hassle-free arrangements.</p>
          </div>

          {/* Feature 3 */}
         <div className="group div-explore-card bg-teal-900 hover:bg-teal-800">
         <h5 className="h2-explore-card">
         <FaStar className="text-4xl sm:text-5xl md:text-6xl text-white transition-transform duration-300 group-hover:text-white"/>
         <span className="text-lg text-white">Rating System</span>
         </h5>
        <p className="p-explore-card text-white">Rate and review other users to ensure a safe carpooling experience.</p>
          </div>

          {/* Feature 4 */}
          <div className="group div-explore-card bg-teal-900 hover:bg-teal-800">
            <h5 className="h2-explore-card">
            <FaMap className="text-4xl sm:text-5xl md:text-6xl text-white transition-transform duration-300 group-hover:text-white"/>
            <span className="text-lg text-white">Real-Time Ride Tracking</span></h5>
            <p className="p-explore-card text-white"> Track your carpool ride in real-time for added convenience and safety.</p>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
};

export default AboutUs;
