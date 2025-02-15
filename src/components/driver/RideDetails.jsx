import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaUsers, FaClock, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { format } from 'date-fns';
import RouteMap from '../maps/RouteMap';

const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled(motion.button)`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
`;

const MapSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  height: 400px;
`;

const InfoSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(74, 222, 128, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
`;

const InfoContent = styled.div`
  flex: 1;

  h3 {
    margin: 0;
    color: #fff;
    font-size: 1rem;
  }

  p {
    margin: 0.25rem 0 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
  }
`;

const RideDetails = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRideDetails();
  }, [rideId]);

  const fetchRideDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/carpool/${rideId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setRide(data.data);
    } catch (error) {
      console.error('Error fetching ride details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !ride) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <BackButton
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft /> Back to Rides
        </BackButton>
      </Header>

      <DetailGrid>
        <MapSection>
          <RouteMap
            startPoint={{ lat: ride.route.coordinates[0][1], lng: ride.route.coordinates[0][0] }}
            endPoint={{ lat: ride.route.coordinates[1][1], lng: ride.route.coordinates[1][0] }}
            readOnly
          />
        </MapSection>

        <InfoSection>
          <InfoItem>
            <Icon>
              <FaCalendarAlt />
            </Icon>
            <InfoContent>
              <h3>Departure Date</h3>
              <p>{format(new Date(ride.schedule[0].departureTime), 'PPP')}</p>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <Icon>
              <FaClock />
            </Icon>
            <InfoContent>
              <h3>Departure Time</h3>
              <p>{format(new Date(ride.schedule[0].departureTime), 'p')}</p>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <Icon>
              <FaUsers />
            </Icon>
            <InfoContent>
              <h3>Available Seats</h3>
              <p>{ride.availableSeats} seats</p>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <Icon>
              <FaDollarSign />
            </Icon>
            <InfoContent>
              <h3>Price per Seat</h3>
              <p>PKR {ride.pricePerSeat}</p>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <Icon>
              <FaMapMarkerAlt />
            </Icon>
            <InfoContent>
              <h3>Route Details</h3>
              <p>From: {ride.route.coordinates[0][1].toFixed(6)}, {ride.route.coordinates[0][0].toFixed(6)}</p>
              <p>To: {ride.route.coordinates[1][1].toFixed(6)}, {ride.route.coordinates[1][0].toFixed(6)}</p>
            </InfoContent>
          </InfoItem>
        </InfoSection>
      </DetailGrid>
    </Container>
  );
};

export default RideDetails; 