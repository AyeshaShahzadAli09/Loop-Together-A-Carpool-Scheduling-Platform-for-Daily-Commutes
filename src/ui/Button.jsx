import { Link } from "react-router-dom";

const Button = ({type , children , disabled , onClick , to}) =>{
  
  const smallBtn = 'px-4 py-2 md:px-5 md:py-2.5 text-xs text-white px-3 m-1 font-semibold uppercase';
  
  const styles = {
      primary: "w-64 px-4 py-2 bg-teal-900 text-white font-semibold rounded-md shadow-sm hover:bg-teal-700 disabled:opacity-50 md:w-full",
      smallDecline: smallBtn + " bg-red-500 rounded-md hover:bg-red-600",
      smallAccept: smallBtn + " bg-green-500 rounded-md hover:bg-green-600",
      smallRequest : smallBtn + " bg-teal-700 rounded-md hover:bg-teal-600",
      linkBtn :  "mt-0.5 underline underline-offset-2 text-blue-500 py-1",
      // position : "uppercase widest-tracking bg-teal-900 text-slate-50 p-2 border border-rounded rounded-md"
     position: "p-2 rounded-md absolute z-[1000]  bottom-16 left-1/2 transform -translate-x-1/2 bg-teal-900",
     secondary :"w-full uppercase border border-teal-900 text-teal-900 p-3 rounded hover:bg-teal-900 hover:text-white dark:bg-teal-900 dark:text-white dark:hover:bg-teal-700",
     modeBtn : "px-4 py-2 bg-emerald-500 text-white dark:bg-emerald-700 rounded",
     link: "text-teal-600 font-bold hover:underline dark:text-teal-400 mr-2",
     linkRed : "text-red-600 font-bold hover:underline dark:text-red-400",
     chatBtn : "text-teal-700 text-4xl",
     cancelRide : "w-80 px-4 py-2 bg-neutral-400 text-red-500 text-lg font-bold rounded-md md:w-ful hover:border"
  };

    //primary :"w-64 px-4 py-2 bg-teal-900 text-white font-semibold rounded-md shadow-sm hover:bg-teal-700 disabled:opacity-50 md:w-full",
    if (to)
        return (
          <Link to={to} className={styles[type]}>
            {children}
          </Link>
        );
    
      if (onClick)
        return (
          <button onClick={onClick} disabled={disabled} className={styles[type]}>
            {children}
          </button>
        );
    
    return(
       <button className={styles[type]} disabled={disabled}>{children}
            </button>
    )
}

export default Button;