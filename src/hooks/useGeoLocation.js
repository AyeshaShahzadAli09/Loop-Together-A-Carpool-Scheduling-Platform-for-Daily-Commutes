import { useState } from "react";
// named export in case we have more than 1 exports
export function useGeoLocation (defaultPosition = null){
    const[isLoading , setIsLoading] = useState(false);
    const [error , setError] = useState(null);
    const[position , setPosition] = useState(defaultPosition); //position == locationName

    function getPosition()
    {
       
        if(!navigator.geolocation)
            return setError("Your browser does not support geolocation");

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition((pos)=>{
            setPosition({lat : pos.coords.latitude,
                lng : pos.coords.longitude
            });
            setIsLoading(false);
        },
        (error)=>{
            setError(error.message);
            setIsLoading(false);
        }
    );
    }
    return {error ,position,isLoading, getPosition};
}