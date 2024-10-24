import { Link } from "react-router-dom";
const Logo = () =>{
    return(
        <Link to='/'>
        <img src="./logo.png" alt="Carpool Together" className="h-14 m-1" />
        </Link>
    )
}

export default Logo;