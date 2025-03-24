import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCarAlt, FaClock, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL, apiRequest } from '../../config';
import ActiveRidePanel from './ActiveRidePanel';

const ActiveRidesPanel = () => {
  const [activeRides, setActiveRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showActiveRideManager, setShowActiveRideManager] = useState(false);

  useEffect(() => {
    fetchActiveRides();
  }, []);

  const fetchActiveRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('rides/active'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      setActiveRides(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching active rides:', error);
      toast.error('Failed to load active rides');
      setLoading(false);
    }
  };

  const handleRideComplete = async () => {
    setShowActiveRideManager(false);
    setSelectedRide(null);
    fetchActiveRides();
  };

  const handleManageRide = (ride) => {
    setSelectedRide(ride);
    setShowActiveRideManager(true);
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showActiveRideManager && selectedRide ? (
        <ActiveRidePanel
          ride={selectedRide}
          onClose={() => setShowActiveRideManager(false)}
          onRideComplete={handleRideComplete}
        />
      ) : (
        <>
          <Header>
            <Title>Active Rides</Title>
          </Header>

          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <p>Loading active rides...</p>
            </LoadingContainer>
          ) : activeRides.length === 0 ? (
            <EmptyState>
              <FaCarAlt size={40} color="rgba(255,255,255,0.2)" />
              <EmptyMessage>No active rides at the moment</EmptyMessage>
              <EmptySubMessage>
                Start one of your scheduled rides to see it here
              </EmptySubMessage>
            </EmptyState>
          ) : (
            <RideList>
              <AnimatePresence>
                {activeRides.map((ride) => (
                  <RideCard
                    key={ride._id}
                    onClick={() => handleManageRide(ride)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RideHeader>
                      <RideTitle>In Progress</RideTitle>
                      <StartTime>
                        <FaClock />
                        Started: {new Date(ride.startTime).toLocaleTimeString()}
                      </StartTime>
                    </RideHeader>

                    <RideDetails>
                      <RideRoute>
                        <FaMapMarkerAlt />
                        <RouteText>
                          <div>{ride.route.from || 'Starting point'}</div>
                          <div>{ride.route.to || 'Destination'}</div>
                        </RouteText>
                      </RideRoute>

                      <RidePassengers>
                        <FaUsers />
                        <div>{ride.passengerCount || 0} passengers</div>
                      </RidePassengers>
                    </RideDetails>

                    <ManageButton
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Manage Ride
                    </ManageButton>
                  </RideCard>
                ))}
              </AnimatePresence>
            </RideList>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled(motion.div)`
  background: rgba(15, 23, 42, 0.3);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #fff;
  margin: 0;
`;

const RideList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  overflow-y: auto;
`;

const RideCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(9, 92, 123, 0.3) 0%, rgba(15, 53, 97, 0.3) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(74, 222, 128, 0.4);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const RideHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RideTitle = styled.h3`
  font-size: 1.2rem;
  color: #4ade80;
  margin: 0;
  background: rgba(74, 222, 128, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-flex;
`;

const StartTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const RideDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const RideRoute = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);

  svg {
    margin-top: 0.25rem;
    min-width: 1rem;
    color: #4ade80;
  }
`;

const RouteText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RidePassengers = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);

  svg {
    color: #4ade80;
  }
`;

const ManageButton = styled(motion.button)`
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  font-weight: 500;
  margin-top: auto;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 222, 128, 0.3);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.7);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #4ade80;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 1rem;
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0 0 0;
`;

const EmptySubMessage = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
`;

export default ActiveRidesPanel; 