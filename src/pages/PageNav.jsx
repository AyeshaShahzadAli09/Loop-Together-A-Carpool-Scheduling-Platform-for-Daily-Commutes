import { NavLink } from "react-router-dom";
import Logo from "./../ui/Logo";
const PageNav = ()=>{
    return(
        <nav className="bg-blue-400 opacity-85 flex items-center justify-between">
             <Logo/>
            <ul  className="flex items-center p-4 font-semibold tracking-widest">
            <li className="p-3 mx-3 hover:px-[0.8rem] inline-block text-sm rounded-full bg-blue-300 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 cursor-pointer hover:ring-4 ring-blue-500 ring-inset"><NavLink to="/">Home</NavLink></li>
                <li className="p-3 mx-3 hover:px-[0.8rem] inline-block text-sm rounded-full bg-blue-300 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 cursor-pointer hover:ring-4 ring-blue-500 ring-inset"><NavLink to="/offerRide">Offer Ride</NavLink></li> 
                <li className="p-3 mx-3 hover:px-[0.8rem] inline-block text-sm rounded-full bg-blue-300 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 cursor-pointer hover:ring-4 ring-blue-500 ring-inset"> <NavLink to="/findRide">Find Ride</NavLink></li>
                <li className="p-3 mx-3 hover:px-[0.8rem] inline-block text-sm rounded-full bg-blue-300 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 cursor-pointer hover:ring-4 ring-blue-500 ring-inset"><NavLink to="/login" className="bg-stone-600">Login</NavLink></li>
            </ul>
        </nav>
    )
}
export default PageNav;