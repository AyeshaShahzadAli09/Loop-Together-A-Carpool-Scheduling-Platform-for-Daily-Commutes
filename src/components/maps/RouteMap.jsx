import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styled from 'styled-components';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const MapWrapper = styled.div`
  position: relative;
  height: ${props => props.height || '400px'};
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;

  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const LocationInfo = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
`;

const SelectionButtons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${props => props.active ? 'rgba(74, 222, 128, 0.9)' : 'rgba(0, 0, 0, 0.8)'};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-5px);
    background: ${props => props.active ? 'rgba(74, 222, 128, 1)' : 'rgba(0, 0, 0, 1)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

const RouteMap = ({ startPoint, setStartPoint, endPoint, setEndPoint, readOnly, height }) => {
  const [center, setCenter] = useState([31.5204, 74.3587]);
  const [zoom, setZoom] = useState(13);
  const [routePath, setRoutePath] = useState([]);
  const [selectionMode, setSelectionMode] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (startPoint && endPoint) {
      calculateRoute(startPoint, endPoint);
    }
  }, [startPoint, endPoint]);

  const calculateRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      if (data.routes && data.routes[0]) {
        setRoutePath(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  const handleMapClick = (e) => {
    if (selectionMode === 'start') {
      if (setStartPoint) setStartPoint(e.latlng);
      setSelectionMode(null);
    } else if (selectionMode === 'end') {
      if (setEndPoint) setEndPoint(e.latlng);
      setSelectionMode(null);
    }
  };

  return (
    <MapWrapper height={height}>
      <LocationInfo>
        {selectionMode === 'start' && (
          <div className="animate-pulse">Click on the map to set start point</div>
        )}
        {selectionMode === 'end' && (
          <div className="animate-pulse">Click on the map to set end point</div>
        )}
        {startPoint && !selectionMode && (
          <div>
            <FaMapMarkerAlt color="green" /> Start: ({startPoint.lat.toFixed(4)}, {startPoint.lng.toFixed(4)})
          </div>
        )}
        {endPoint && !selectionMode && (
          <div>
            <FaMapMarkerAlt color="red" /> End: ({endPoint.lat.toFixed(4)}, {endPoint.lng.toFixed(4)})
          </div>
        )}
      </LocationInfo>

      {!readOnly && (
        <SelectionButtons>
          <Button 
            onClick={ () => setSelectionMode('start') }
            active={selectionMode === 'start'}
            disabled={selectionMode === 'end'}
          >
            <FaMapMarkerAlt color="green" />
            Set Start Point
          </Button>
          <Button 
            onClick={ () => setSelectionMode('end') }
            active={selectionMode === 'end'}
            disabled={selectionMode === 'start'}
          >
            <FaMapMarkerAlt color="red" />
            Set End Point
          </Button>
        </SelectionButtons>
      )}

      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!readOnly && <MapClickHandler onMapClick={handleMapClick} />}
        
        {startPoint && (
          <Marker position={startPoint} icon={startIcon}>
            <Popup>
              <strong>Start Point</strong>
              <br />
              Lat: {startPoint.lat.toFixed(6)}
              <br />
              Lng: {startPoint.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}
        
        {endPoint && (
          <Marker position={endPoint} icon={endIcon}>
            <Popup>
              <strong>End Point</strong>
              <br />
              Lat: {endPoint.lat.toFixed(6)}
              <br />
              Lng: {endPoint.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}
        {routePath.length > 0 && (
          <Polyline
            positions={routePath}
            color="#4ade80"
            weight={4}
            opacity={0.6}
          />
        )}
      </MapContainer>
    </MapWrapper>
  );
};

export default RouteMap; 