import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../utils/themeSlice';
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import Logo from "./../ui/Logo";
import Button from '../ui/Button';

const PageNav = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [isOpen, setIsOpen] = useState(false); 

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <nav className="font-playfair bg-teal-900 flex items-center justify-between sticky top-0 z-50 px-4 py-2">
      <div className="flex items-center">
        <Logo />
        <span className="font-dancing text-2xl md:text-4xl font-bold text-emerald-300 ml-2">
          Loop Together
        </span>
      </div>
      {/* Hamburger icon for mobile */}
      <button
        onClick={handleToggleMenu}
        className="md:hidden text-white focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* Navigation Links */}
      <ul
        className={`flex items-center p-3 font-semibold tracking-widest space-x-4 ${isOpen ? 'flex-col  absolute top-16 left-0 bg-teal-900 w-full mt-5 md:w-auto md:flex-row' : 'hidden md:flex'}`}>
        {/* Auth Buttons */}
        <SignedOut>
        <li className="navitems xs:my-1">
          <NavLink to="/">Home</NavLink>
        </li>
          <li className="navitems xs:my-2">
            <SignInButton>
             REGISTER
            </SignInButton>
          </li>
        </SignedOut>

        <SignedIn> 
        <li className="navitems xs:my-1">
        <NavLink to="/app/carpoolDashboard">Carpools</NavLink>
      </li>
      <li className="navitems xs:my-1">
        <NavLink to="/app/offerRide">Offer Ride</NavLink>
      </li>
      <li className="navitems xs:my-1">
        <NavLink to="/app/findRide">Find Ride</NavLink>
      </li>
      <li className="xs:my-2">
        <UserButton />
      </li>
        </SignedIn>

        <li className="mx-3 text-lg xs:my-1">
            <Button type="modeBtn" onClick={() => dispatch(toggleTheme())}>{isDarkMode ? <CiLight /> : <MdOutlineDarkMode />}
            </Button>
        </li>
      </ul>
    </nav>
  )
}
export default PageNav;