import { Link } from "react-router-dom";
const Logo = () =>{
    return(
        <Link to='/'>
        <img src="public\Logo.png" alt="Carpool Together" className="size-20 mx-3 rotate-12" />
        </Link>
    )
}

export default Logo;