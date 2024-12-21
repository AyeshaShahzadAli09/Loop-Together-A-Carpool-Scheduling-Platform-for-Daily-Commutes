import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

function Map({ departureCoordinates, destinationCoordinates }) {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [origin, setOrigin] = useState(departureCoordinates || [51.505, -0.09]);
  const [destination, setDestination] = useState(destinationCoordinates || [51.505, -0.09]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeoLocation();
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  useEffect(() => {
    if (departureCoordinates) setOrigin(departureCoordinates);
  }, [departureCoordinates]);

  useEffect(() => {
    if (destinationCoordinates) setDestination(destinationCoordinates);
  }, [destinationCoordinates]);

  // Calculate the distance between two points (in kilometers)
  const calculateDistance = (origin, destination) => {
    if (!origin || !destination) return 0;
    const rad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = rad(destination.lat - origin.lat);
    const dLng = rad(destination.lng - origin.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(origin.lat)) *
        Math.cos(rad(destination.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  return (
    <div>
      {/* {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )} */}

      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        
        {/* Markers for Origin and Destination */}
        {origin && origin.lat !== undefined && origin.lng !== undefined && (
          <Marker position={[origin.lat, origin.lng]}>
            <Popup>Origin Location</Popup>
          </Marker>
        )}

        {destination && destination.lat !== undefined && destination.lng !== undefined && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>Destination Location</Popup>
          </Marker>
        )}

        {/* Polyline to highlight the distance between Origin and Destination */}
        {origin && destination && (
          <Polyline positions={[origin, destination]} color="blue" />
        )}

        {/* Display distance if both origin and destination are set */}
        {origin && destination && (
          <div>
            Distance: {calculateDistance(origin, destination).toFixed(2)} km
          </div>
        )}

        {/* <ChangeCenter position={mapPosition} />
        <DetectClick
          setOrigin={setOrigin}
          setDestination={setDestination}
          origin={origin}
          destination={destination}
        /> */}
      </MapContainer>
    </div>
  );
}

// function ChangeCenter({ position }) {
//   const map = useMap();
//   map.setView(position);
//   return null;
// }

// function DetectClick({ setOrigin, setDestination, origin, destination }) {
//   const navigate = useNavigate();

//   useMapEvents({
//     click: (e) => {
//       if (!origin) {
//         setOrigin({ lat: e.latlng.lat, lng: e.latlng.lng });
//       } else if (!destination) {
//         setDestination({ lat: e.latlng.lat, lng: e.latlng.lng });
//       }
//       navigate(
//         `form?originLat=${origin ? origin.lat : e.latlng.lat}&originLng=${
//           origin ? origin.lng : e.latlng.lng
//         }&destinationLat=${destination ? destination.lat : e.latlng.lat}&destinationLng=${
//           destination ? destination.lng : e.latlng.lng
//         }`
//       );
//     },
//   });
// }

export default Map;
