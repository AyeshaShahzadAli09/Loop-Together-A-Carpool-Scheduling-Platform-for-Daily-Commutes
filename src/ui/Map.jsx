import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  // Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGeoLocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

const Map = () =>{
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const {isLoading: isLoadingPosition , position: geoLocationPosition, getPosition} = useGeoLocation();

  //this useEffect handles whenever the location changes like the "use ur position" btn is clicked , new location (lat , lng) is stored in mapPosition
  useEffect(function(){
        if(geoLocationPosition) 
            setMapPosition([geoLocationPosition.lat,geoLocationPosition.lng])
  },[geoLocationPosition])

  const [mapLat, mapLng] = useUrlPosition();

 useEffect(function(){
    if(mapLat && mapLng)
      setMapPosition([mapLat,mapLng]);
 }
,[mapLat, mapLng])
  return(
    <div className="flex-1 h-full relative text-white">
    {/* {isLoadingPosition ? <Button position='type' onClick={getPosition}>{isLoadingPosition ? 'Loading...' : 'Use Your Position'}</Button> :  " "} */}
    {!geoLocationPosition && (
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Use your Location"} 
      </Button> 
      )}

    <MapContainer
      center={mapPosition}
      // center={[mapLat,mapLng]}
      //this senter is not interactive when position changes , map pointer does not change , in leaflet library everything works with component so we have to make a component for this
      zoom={13}
      scrollWheelZoom={true}
      className="h-screen"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {/* {cities.map((city) => ( */}
        <Marker
          position={mapPosition}
          // key = {city.id}
        >
          <Popup>
            <span>{mapPosition || "Fetching location..."} <br /></span>
          </Popup>
        </Marker>
       {/* ))}  */}
       <ChangeCenter position={mapPosition} />
       <DetectClick />
    </MapContainer>
  </div>
  )
}

// CUSTOM COMPONENTS
function ChangeCenter({position})
{
  const map = useMap();
  // console.log(position)
  if (position  && !isNaN(position[0]) && !isNaN(position[1])) { //&& position.length === 2
    map.setView(position);
  } else {
    console.error("Invalid position:", position);
  }
  return null;
}

// whenever click on the map , form open(location entered into the form auto)
function DetectClick()
{
    const navigate = useNavigate();
    useMapEvents({
      // console.log(e);LatLng object coming fro leaflet lib not from dom or browser
      click : (e)=>navigate(`offerRide?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    })

}

export default Map;
