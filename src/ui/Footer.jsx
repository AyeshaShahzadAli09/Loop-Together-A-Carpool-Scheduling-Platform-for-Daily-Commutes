import { Link } from "react-router-dom";
import Faqs from "../pages/FAQS";

const Footer = () =>{

    return(
        <footer className="bg-gray-800 text-white py-8 tracking-widest">
         <div className="container mx-auto text-center">
    {/* Title */}
    <h2 className="text-2xl font-bold mb-4">Loop Together</h2>

    {/* FAQ Links */}
    <div className="mb-4">
      <Link to="/faqs" className="mx-2 hover:underline">FAQ</Link>
      <a href="#about" className="mx-2 hover:underline">About Us</a>
      <a href="#contact" className="mx-2 hover:underline">Contact Us</a>
      <a href="#terms" className="mx-2 hover:underline">Terms & Conditions</a>
      <a href="#blog" className="mx-2 hover:underline">Blog</a>
    </div>

    {/* Social Media Icons */}
    <div className="mb-4">
      <a href="#" className="mx-2">
        <i className="fab fa-facebook fa-lg hover:text-blue-500"></i>
      </a>
      <a href="#" className="mx-2">
        <i className="fab fa-twitter fa-lg hover:text-blue-400"></i>
      </a>
      <a href="#" className="mx-2">
        <i className="fab fa-instagram fa-lg hover:text-pink-500"></i>
      </a>
      <a href="#" className="mx-2">
        <i className="fab fa-linkedin fa-lg hover:text-blue-600"></i>
      </a>
    </div>

    {/* Copyright Text */}
    <div className="text-base">
      Copyright &copy; {new Date().getFullYear()}  looptogether.com.pk  All rights reserved.
    </div>
  </div>
</footer>
    )
}

export default Footer;