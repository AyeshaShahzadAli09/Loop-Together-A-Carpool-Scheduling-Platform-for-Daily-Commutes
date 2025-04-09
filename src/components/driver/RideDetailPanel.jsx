import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUsers, FaDollarSign, FaMapMarkerAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import RouteMap from '../maps/RouteMap';
import LocationDisplay from '../common/LocationDisplay';

// Added new header container for the Close button
const PanelHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem; // Provides space between the Close button and the map
`;

const PanelContainer = styled(motion.div)`
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  border-radius: 10px;
  color: #fff;
  height: 130vh;
  max-height: 130vh;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: rgba(74, 222, 128, 0.2);
  border: none;
  border-radius: 5px;
  color: #4ade80;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(74, 222, 128, 0.4);
  }
`;

const MapSection = styled.div`
  height: 300px;       // fixed height for map preview
  margin-bottom: 10rem; // slight gap between map and details
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; // Reduced gap for a tighter, yet clear layout
`;

const InfoItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 30px;
  height: 30px;
  background: rgba(74, 222, 128, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RideDetailPanel = ({ ride, onClose }) => {
  if (!ride) return null;

  const startPoint = {
    lat: ride.route.coordinates[0][1],
    lng: ride.route.coordinates[0][0]
  };

  const endPoint = {
    lat: ride.route.coordinates[1][1],
    lng: ride.route.coordinates[1][0]
  };

  return (
    <PanelContainer
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PanelHeader>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </PanelHeader>

      <MapSection>
        <RouteMap
          startPoint={startPoint}
          endPoint={endPoint}
          readOnly
        />
      </MapSection>

      <InfoSection>
        <InfoItem>
          <IconWrapper>
            <FaCalendarAlt />
          </IconWrapper>
          <div>
            <div>Departure Date:</div>
            <div>{format(new Date(ride.schedule[0].departureTime), 'PPP')}</div>
          </div>
        </InfoItem>
        <InfoItem>
          <IconWrapper>
            <FaClock />
          </IconWrapper>
          <div>
            <div>Departure Time:</div>
            <div>{format(new Date(ride.schedule[0].departureTime), 'p')}</div>
          </div>
        </InfoItem>
        <InfoItem>
          <IconWrapper>
            <FaUsers />
          </IconWrapper>
          <div>
            <div>Available Seats:</div>
            <div>{ride.availableSeats} seats</div>
          </div>
        </InfoItem>
        <InfoItem>
          <IconWrapper>
            <FaDollarSign />
          </IconWrapper>
          <div>
            <div>Price per Seat:</div>
            <div>PKR {ride.pricePerSeat}</div>
          </div>
        </InfoItem>
        <InfoItem>
          <IconWrapper>
            <FaMapMarkerAlt />
          </IconWrapper>
          <div>
            <div>Route:</div>
            <div>
              <LocationDisplay lat={startPoint.lat} lng={startPoint.lng} type="from" />
              <LocationDisplay lat={endPoint.lat} lng={endPoint.lng} type="to" />
            </div>
          </div>
        </InfoItem>
      </InfoSection>
    </PanelContainer>
  );
};

export default RideDetailPanel; 