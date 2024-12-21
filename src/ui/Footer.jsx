import { Link } from "react-router-dom";

const Footer = () =>{

    return(
        <footer className="bg-teal-900 text-white py-8 tracking-widest">
         <div className="container mx-auto text-center">
    <h2 className="text-2xl font-bold mb-4">Loop Together</h2>
    <div className="mb-4">
      <Link to="/faqs" className="mx-2 hover:underline">FAQ</Link>
      <Link to="/contact" className="mx-2 hover:underline">Contact Us</Link>
      <Link to="/aboutUs" className="mx-2 hover:underline">About Us</Link>
      <Link to="/terms" className="mx-2 hover:underline">Terms & Conditions</Link>
      <Link to="/feedbackList" className="mx-2 hover:underline">Users Review</Link>
      <Link to="/feedbackForm" className="mx-2 hover:underline">Feedback</Link>
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

    <div className="text-base">
      Copyright &copy; {new Date().getFullYear()}  looptogether.com.pk  All rights reserved.
    </div>
  </div>
</footer>
    )
}

export default Footer;