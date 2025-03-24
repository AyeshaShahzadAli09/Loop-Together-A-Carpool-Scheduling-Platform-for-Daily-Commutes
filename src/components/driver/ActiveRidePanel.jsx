import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaUserAlt, FaTimes, FaCarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL, apiRequest } from '../../config';

const ActiveRidePanel = ({ ride, onClose, onRideComplete }) => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickupsComplete, setPickupsComplete] = useState(false);
  
  useEffect(() => {
    if (ride) {
      fetchPassengers();
    }
  }, [ride]);

  const fetchPassengers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/ride-requests/ride-passengers/${ride._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPassengers(response.data.data);
      checkAllPickupsComplete(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load passengers');
      console.error(error);
      setLoading(false);
    }
  };

  const handlePickupPassenger = async (requestId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(apiRequest(`rides/pickup/${requestId}`), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Passenger marked as picked up');
      
      // Update local state
      const updatedPassengers = passengers.map(p => 
        p._id === requestId ? { ...p, status: 'PickedUp' } : p
      );
      
      setPassengers(updatedPassengers);
      checkAllPickupsComplete(updatedPassengers);
    } catch (error) {
      toast.error('Failed to update passenger status');
      console.error(error);
    }
  };

  const checkAllPickupsComplete = (passengerList) => {
    const allPickedUp = passengerList.every(p => p.status === 'PickedUp');
    setPickupsComplete(allPickedUp && passengerList.length > 0);
  };

  const handleCompleteRide = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(apiRequest(`rides/complete/${ride._id}`), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Ride completed successfully');
      if (onRideComplete) onRideComplete();
      if (onClose) onClose();
    } catch (error) {
      toast.error('Failed to complete ride');
      console.error(error);
    }
  };

  if (!ride) return null;

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <Header>
        <Title>Active Ride: {ride.route?.from} to {ride.route?.to}</Title>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </Header>

      <Content>
        <RideInfo>
          <StatusBadge active>In Progress</StatusBadge>
          <p>Started at: {new Date().toLocaleTimeString()}</p>
          <p>Passengers to pick up: {passengers.filter(p => p.status !== 'PickedUp').length}</p>
        </RideInfo>

        <PassengerSection>
          <SectionTitle>Passengers</SectionTitle>
          
          {loading ? (
            <LoadingMessage>Loading passengers...</LoadingMessage>
          ) : passengers.length === 0 ? (
            <EmptyMessage>No passengers for this ride</EmptyMessage>
          ) : (
            <>
              <PassengerList>
                <PassengerCategory>
                  <CategoryTitle>To Be Picked Up</CategoryTitle>
                  {passengers.filter(p => p.status !== 'PickedUp').length === 0 ? (
                    <EmptyMessage>All passengers picked up!</EmptyMessage>
                  ) : (
                    passengers
                      .filter(p => p.status !== 'PickedUp')
                      .map(passenger => (
                        <PassengerCard key={passenger._id}>
                          <Avatar>
                            {passenger.passenger.profilePicture ? (
                              <img src={passenger.passenger.profilePicture} alt="Profile" />
                            ) : (
                              <FaUserAlt />
                            )}
                          </Avatar>
                          <PassengerInfo>
                            <PassengerName>{passenger.passenger.name}</PassengerName>
                            <PassengerDetails>
                              {passenger.passenger.gender} · {passenger.seatsRequested} seat(s)
                            </PassengerDetails>
                          </PassengerInfo>
                          <ActionButton
                            onClick={() => handlePickupPassenger(passenger._id)}
                          >
                            Mark as Picked Up
                          </ActionButton>
                        </PassengerCard>
                      ))
                  )}
                </PassengerCategory>

                <PassengerCategory>
                  <CategoryTitle>Picked Up</CategoryTitle>
                  {passengers.filter(p => p.status === 'PickedUp').length === 0 ? (
                    <EmptyMessage>No passengers picked up yet</EmptyMessage>
                  ) : (
                    passengers
                      .filter(p => p.status === 'PickedUp')
                      .map(passenger => (
                        <PassengerCard key={passenger._id} picked>
                          <Avatar>
                            {passenger.passenger.profilePicture ? (
                              <img src={passenger.passenger.profilePicture} alt="Profile" />
                            ) : (
                              <FaUserAlt />
                            )}
                          </Avatar>
                          <PassengerInfo>
                            <PassengerName>{passenger.passenger.name}</PassengerName>
                            <PassengerDetails>
                              {passenger.passenger.gender} · {passenger.seatsRequested} seat(s)
                            </PassengerDetails>
                          </PassengerInfo>
                          <PickedUpBadge>
                            <FaCheckCircle /> Picked Up
                          </PickedUpBadge>
                        </PassengerCard>
                      ))
                  )}
                </PassengerCategory>
              </PassengerList>

              <CompleteRideButtonContainer>
                <CompleteRideButton
                  disabled={!pickupsComplete}
                  onClick={handleCompleteRide}
                >
                  <FaCarAlt /> Complete Ride
                </CompleteRideButton>
                {!pickupsComplete && (
                  <CompleteWarning>
                    You must pick up all passengers before completing the ride
                  </CompleteWarning>
                )}
              </CompleteRideButtonContainer>
            </>
          )}
        </PassengerSection>
      </Content>
    </Container>
  );
};

// Styled components would go here - similar to existing styles
const Container = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8);
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// ... Other styled components would follow, matching your app's design

export default ActiveRidePanel; 