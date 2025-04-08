import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaUserAlt, FaTimes, FaCarAlt, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../../config';

const ActiveRidePanel = ({ ride, onClose, onRideComplete }) => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickupsComplete, setPickupsComplete] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (ride?._id) {
      fetchPassengers();
    } else {
      setError('Ride information is missing or incomplete');
      setLoading(false);
    }
  }, [ride]);

  const fetchPassengers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('userToken');
      
      // Use apiRequest helper instead of hardcoded URL
      const response = await axios.get(apiRequest(`ride-requests/ride-passengers/${ride._id}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPassengers(response.data.data || []);
      checkAllPickupsComplete(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load passengers:', error);
      setError('Failed to load passengers. Please try again.');
      toast.error('Failed to load passengers');
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
      console.error('Failed to update passenger status:', error);
      toast.error('Failed to update passenger status');
    }
  };

  const checkAllPickupsComplete = (passengerList) => {
    // Check if all passengers are picked up
    const allPickedUp = passengerList.length > 0 && 
      passengerList.every(p => p.status === 'PickedUp');
    setPickupsComplete(allPickedUp);
  };

  const handleCompleteRide = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(apiRequest(`rides/complete/${ride._id}`), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Ride completed successfully');
      
      if (typeof onRideComplete === 'function') {
        onRideComplete();
      }
    } catch (error) {
      console.error('Failed to complete ride:', error);
      toast.error('Failed to complete ride');
    }
  };

  // If there's an error, show error message
  if (error) {
    return (
      <Container>
        <Header>
          <Title>Active Ride</Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>
        <ErrorMessage>
          <p>{error}</p>
          <RetryButton onClick={fetchPassengers}>
            Retry
          </RetryButton>
        </ErrorMessage>
      </Container>
    );
  }

  // If loading, show loading spinner
  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Active Ride</Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading ride information...</p>
        </LoadingContainer>
      </Container>
    );
  }

  // If no ride data is available
  if (!ride) {
    return (
      <Container>
        <Header>
          <Title>Active Ride</Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>
        <ErrorMessage>
          <p>No ride information available</p>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          Active Ride: {ride.route?.from || 'Starting point'} to {ride.route?.to || 'Destination'}
        </Title>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </Header>

      <Content>
        <RideInfo>
          <StatusBadge active>In Progress</StatusBadge>
          <InfoItem>
            <FaClock />
            <p>Started at: {ride.startTime ? new Date(ride.startTime).toLocaleTimeString() : 'Not started'}</p>
          </InfoItem>
          <InfoItem>
            <FaUsers />
            <p>Passengers to pick up: {passengers.filter(p => p.status !== 'PickedUp').length}</p>
          </InfoItem>
          <InfoItem>
            <FaMapMarkerAlt />
            <p>From: {ride.route?.from || 'Starting point'}</p>
          </InfoItem>
          <InfoItem>
            <FaMapMarkerAlt />
            <p>To: {ride.route?.to || 'Destination'}</p>
          </InfoItem>
        </RideInfo>

        <PassengerSection>
          <SectionTitle>Passengers</SectionTitle>
          
          {passengers.length === 0 ? (
            <EmptyMessage>No passengers for this ride</EmptyMessage>
          ) : (
            <>
              <PassengerList>
                {passengers.filter(p => p.status !== 'PickedUp').length > 0 ? (
                  <>
                    <ListTitle>To Be Picked Up</ListTitle>
                    {passengers
                      .filter(p => p.status !== 'PickedUp')
                      .map(passenger => (
                        <PassengerCard key={passenger._id}>
                          <PassengerInfo>
                            <Avatar>
                              {passenger.passenger?.profilePicture ? (
                                <img 
                                  src={passenger.passenger.profilePicture} 
                                  alt={passenger.passenger.name || 'Passenger'}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/40';
                                  }}
                                />
                              ) : (
                                <FaUserAlt />
                              )}
                            </Avatar>
                            <div>
                              <PassengerName>{passenger.passenger?.name || 'Passenger'}</PassengerName>
                              <PassengerStatus>Waiting for pickup</PassengerStatus>
                            </div>
                          </PassengerInfo>
                          <PickupButton
                            onClick={() => handlePickupPassenger(passenger._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Mark as Picked Up
                          </PickupButton>
                        </PassengerCard>
                      ))}
                  </>
                ) : null}
                
                {passengers.filter(p => p.status === 'PickedUp').length > 0 ? (
                  <>
                    <ListTitle>Picked Up</ListTitle>
                    {passengers
                      .filter(p => p.status === 'PickedUp')
                      .map(passenger => (
                        <PassengerCard key={passenger._id} pickedUp>
                          <PassengerInfo>
                            <Avatar>
                              {passenger.passenger?.profilePicture ? (
                                <img 
                                  src={passenger.passenger.profilePicture} 
                                  alt={passenger.passenger.name || 'Passenger'}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/40';
                                  }}
                                />
                              ) : (
                                <FaUserAlt />
                              )}
                            </Avatar>
                            <div>
                              <PassengerName>{passenger.passenger?.name || 'Passenger'}</PassengerName>
                              <PassengerStatus pickedUp>
                                <FaCheckCircle /> Picked Up
                              </PassengerStatus>
                            </div>
                          </PassengerInfo>
                        </PassengerCard>
                      ))}
                  </>
                ) : null}
              </PassengerList>
              
              <CompleteRideButton
                disabled={!pickupsComplete}
                onClick={handleCompleteRide}
                whileHover={pickupsComplete ? { scale: 1.05 } : {}}
                whileTap={pickupsComplete ? { scale: 0.95 } : {}}
              >
                {pickupsComplete ? 
                  'Complete Ride' : 
                  'Pick up all passengers to complete ride'}
              </CompleteRideButton>
            </>
          )}
        </PassengerSection>
      </Content>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  background: rgba(22, 28, 36, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: white;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1.25rem;
  
  &:hover {
    color: white;
  }
`;

const Content = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const RideInfo = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0;
  color: white;
  
  svg {
    color: #4ade80;
  }
  
  p {
    margin: 0;
  }
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.active ? 'rgba(74, 222, 128, 0.2)' : 'rgba(148, 163, 184, 0.2)'};
  color: ${props => props.active ? '#4ade80' : '#94a3b8'};
  margin-bottom: 0.75rem;
`;

const PassengerSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: white;
`;

const PassengerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListTitle = styled.h4`
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PassengerCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.pickedUp ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.pickedUp ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
`;

const PassengerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PassengerName = styled.div`
  font-weight: 500;
  color: white;
`;

const PassengerStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.pickedUp ? '#4ade80' : 'rgba(255, 255, 255, 0.6)'};
  margin-top: 0.25rem;
`;

const PickupButton = styled(motion.button)`
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(74, 222, 128, 0.3);
  }
`;

const CompleteRideButton = styled(motion.button)`
  width: 100%;
  margin-top: 2rem;
  background: ${props => props.disabled ? 'rgba(148, 163, 184, 0.2)' : 'rgba(74, 222, 128, 0.2)'};
  color: ${props => props.disabled ? '#94a3b8' : '#4ade80'};
  border: 1px solid ${props => props.disabled ? 'rgba(148, 163, 184, 0.3)' : 'rgba(74, 222, 128, 0.3)'};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background: ${props => props.disabled ? 'rgba(148, 163, 184, 0.2)' : 'rgba(74, 222, 128, 0.3)'};
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: white;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4ade80;
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #ef4444;
  text-align: center;
  padding: 0 2rem;
`;

const RetryButton = styled.button`
  margin-top: 1rem;
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(74, 222, 128, 0.3);
  }
`;

export default ActiveRidePanel; 