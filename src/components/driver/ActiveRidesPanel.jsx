import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL, apiRequest } from '../../config';
import ActiveRidePanel from './ActiveRidePanel';
import { reverseGeocodeWithDelay } from '../../utils/geocoding';

const ActiveRidesPanel = () => {
  const [activeRides, setActiveRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showActiveRideManager, setShowActiveRideManager] = useState(false);
  const [locationNames, setLocationNames] = useState({});

  useEffect(() => {
    fetchActiveRides();
  }, []);

  useEffect(() => {
    if (activeRides.length > 0) {
      fetchLocationNames();
    }
  }, [activeRides]);

  const fetchActiveRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('rides/active'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      const rides = response.data.data || [];
      console.log('Active rides loaded:', rides);
      setActiveRides(rides);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching active rides:', error);
      toast.error('Failed to load active rides');
      setLoading(false);
    }
  };

  const fetchLocationNames = async () => {
    try {
      const newLocationNames = {};
      const uniqueLocations = new Set();
      
      // Collect all unique coordinates from rides
      activeRides.forEach(ride => {
        if (ride.route && ride.route.coordinates) {
          // Handle both starting and destination coordinates
          if (Array.isArray(ride.route.coordinates) && ride.route.coordinates.length >= 2) {
            uniqueLocations.add(`${ride.route.coordinates[0][1]},${ride.route.coordinates[0][0]}`);
            uniqueLocations.add(`${ride.route.coordinates[1][1]},${ride.route.coordinates[1][0]}`);
          }
        }
      });

      // Filter out coordinates we already have
      const locationsToFetch = Array.from(uniqueLocations)
        .filter(coordKey => !locationNames[coordKey]);

      if (locationsToFetch.length === 0) return;

      // Fetch in parallel with a maximum of 4 concurrent requests
      const batchSize = 4;
      for (let i = 0; i < locationsToFetch.length; i += batchSize) {
        const batch = locationsToFetch.slice(i, i + batchSize);
        const promises = batch.map(coordKey => {
          const [lat, lng] = coordKey.split(',').map(Number);
          return reverseGeocodeWithDelay(lat, lng)
            .then(name => ({ coordKey, name }))
            .catch(() => ({ coordKey, name: coordKey }));
        });

        const results = await Promise.all(promises);
        results.forEach(({ coordKey, name }) => {
          newLocationNames[coordKey] = name;
        });
      }

      if (Object.keys(newLocationNames).length > 0) {
        setLocationNames(prev => ({ ...prev, ...newLocationNames }));
      }
    } catch (error) {
      console.error('Error fetching location names:', error);
    }
  };

  const getLocationName = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return 'Unknown location';
    }

    const key = `${coordinates[1]},${coordinates[0]}`;
    return locationNames[key] || `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
  };

  const handleRideComplete = async () => {
    setShowActiveRideManager(false);
    setSelectedRide(null);
    fetchActiveRides();
  };

  const handleRideUpdated = async () => {
    // Refresh the ride data in the parent component and update selectedRide
    fetchActiveRides();
    
    // If there's a selected ride, refresh its data
    if (selectedRide && selectedRide._id) {
      const token = localStorage.getItem('userToken');
      try {
        const response = await axios.get(apiRequest(`rides/${selectedRide._id}`), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success && response.data.data) {
          setSelectedRide({...response.data.data, locationNames});
        }
      } catch (error) {
        console.error('Error refreshing selected ride:', error);
      }
    }
  };

  const handleManageRide = (ride) => {
    if (!ride || !ride._id) {
      console.error('Cannot manage ride: Invalid ride data', ride);
      toast.error('Cannot manage this ride: Missing ride information');
      return;
    }
    
    console.log('Managing ride:', ride);
    setSelectedRide({...ride, locationNames});
    setShowActiveRideManager(true);
  };

  const handleBackToList = () => {
    setSelectedRide(null);
    setShowActiveRideManager(false);
  };

  return (
    <Container>
      <Title>Active Rides</Title>
      
      {loading ? (
        <LoadingContainer>
          <LoadingIndicator />
          <LoadingText>Loading active rides...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
          {showActiveRideManager && selectedRide ? (
            <RideManagerContainer>
              <BackButton onClick={handleBackToList}>
                <FaArrowLeft /> Back to Active Rides
              </BackButton>
              
              <ActiveRidePanel
                ride={selectedRide}
                onClose={handleBackToList}
                onRideComplete={handleRideComplete}
                onRideUpdated={handleRideUpdated}
              />
            </RideManagerContainer>
          ) : (
            <RideList>
              <AnimatePresence>
                {activeRides.length === 0 ? (
                  <NoRidesMessage>
                    You have no active rides at the moment.
                  </NoRidesMessage>
                ) : (
                  activeRides.map((ride) => (
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
                            <div>From: {ride.route && ride.route.coordinates ? 
                              getLocationName(ride.route.coordinates[0]) : 
                              (ride.route.from || 'Starting point')}
                            </div>
                            <div>To: {ride.route && ride.route.coordinates ? 
                              getLocationName(ride.route.coordinates[1]) : 
                              (ride.route.to || 'Destination')}
                            </div>
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
                  ))
                )}
              </AnimatePresence>
            </RideList>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: white;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const LoadingIndicator = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top: 4px solid #ff00ff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  margin-top: 16px;
  color: white;
  font-size: 16px;
`;

const RideManagerContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const NoRidesMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-top: 20px;
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

export default ActiveRidesPanel; 