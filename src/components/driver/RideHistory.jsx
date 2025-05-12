import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaMoneyBillWave, FaStar } from 'react-icons/fa';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../../config';
import { reverseGeocodeWithDelay } from '../../utils/geocoding';

const RideHistory = () => {
  const [completedRides, setCompletedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);
  const [locationNames, setLocationNames] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchCompletedRides();
  }, []);

  useEffect(() => {
    if (completedRides.length > 0) {
      fetchLocationNames();
    }
  }, [completedRides]);

  const fetchCompletedRides = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('userToken');
      
      const response = await axios.get(apiRequest('rides/history'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCompletedRides(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load ride history:', error);
      setError('Failed to load ride history. Please try again.');
      toast.error('Failed to load ride history');
      setLoading(false);
    }
  };

  const fetchLocationNames = async () => {
    try {
      const newLocationNames = {};
      const uniqueLocations = new Set();
      
      // Collect all unique coordinates from rides
      completedRides.forEach(ride => {
        if (ride.route && ride.route.coordinates) {
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

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedRide(null);
  };

  const calculateTotalFare = (ride) => {
    if (!ride || !ride.rideRequests || ride.rideRequests.length === 0) return 0;
    
    return ride.rideRequests.reduce((total, request) => {
      return total + (ride.pricePerSeat * (request.seatsRequested || 1));
    }, 0);
  };

  const calculateAverageRating = (ride) => {
    if (!ride || !ride.ratings || ride.ratings.length === 0) return 0;
    
    const sum = ride.ratings.reduce((total, rating) => total + rating.rating, 0);
    return (sum / ride.ratings.length).toFixed(1);
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Ride History</Title>
        </Header>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading ride history...</p>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Ride History</Title>
        </Header>
        <ErrorMessage>
          <p>{error}</p>
          <RetryButton onClick={fetchCompletedRides}>
            Retry
          </RetryButton>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Ride History</Title>
      </Header>

      {completedRides.length === 0 ? (
        <EmptyMessage>
          You don't have any completed rides yet.
        </EmptyMessage>
      ) : (
        <RideGrid>
          <AnimatePresence>
            {completedRides.map((ride) => {
              const startingPoint = ride.route && ride.route.coordinates ? 
                getLocationName(ride.route.coordinates[0]) : 
                (ride.route?.from || 'Starting point');
              
              const destination = ride.route && ride.route.coordinates ? 
                getLocationName(ride.route.coordinates[1]) : 
                (ride.route?.to || 'Destination');
                
              const totalFare = calculateTotalFare(ride);
              const averageRating = calculateAverageRating(ride);
              
              return (
                <RideCard
                  key={ride._id}
                  onClick={() => handleViewDetails(ride)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RideDate>
                    <FaCalendarAlt />
                    <span>{format(new Date(ride.endTime || ride.createdAt), 'PP')}</span>
                  </RideDate>
                  
                  <RideInfo>
                    <FaClock />
                    <p>{format(new Date(ride.endTime || ride.createdAt), 'p')}</p>
                  </RideInfo>
                  
                  <RideInfo>
                    <FaMapMarkerAlt />
                    <div>
                      <div><strong>From:</strong> {startingPoint}</div>
                      <div><strong>To:</strong> {destination}</div>
                    </div>
                  </RideInfo>
                  
                  <RideInfo>
                    <FaUsers />
                    <p>{ride.rideRequests ? ride.rideRequests.length : 0} passengers</p>
                  </RideInfo>
                  
                  <RideInfo>
                    <FaMoneyBillWave />
                    <p>PKR {totalFare}</p>
                  </RideInfo>
                  
                  {ride.ratings && ride.ratings.length > 0 && (
                    <RatingContainer>
                      <span>{averageRating}</span>
                      <FaStar color="#FFD700" />
                      <span>({ride.ratings.length})</span>
                    </RatingContainer>
                  )}
                  
                  <ViewButton>View Details</ViewButton>
                </RideCard>
              );
            })}
          </AnimatePresence>
        </RideGrid>
      )}

      {/* Ride Details Modal */}
      <AnimatePresence>
        {showDetails && selectedRide && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RideDetailModal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalHeader>
                <h2>Ride Details</h2>
                <CloseButton onClick={handleCloseDetails}>×</CloseButton>
              </ModalHeader>
              
              <ModalContent>
                <DetailSection>
                  <SectionTitle>Route Information</SectionTitle>
                  <DetailItem>
                    <FaCalendarAlt />
                    <div>
                      <DetailLabel>Date</DetailLabel>
                      <DetailValue>
                        {format(new Date(selectedRide.endTime || selectedRide.createdAt), 'PPP')}
                      </DetailValue>
                    </div>
                  </DetailItem>
                  
                  <DetailItem>
                    <FaClock />
                    <div>
                      <DetailLabel>Time</DetailLabel>
                      <DetailValue>
                        {format(new Date(selectedRide.endTime || selectedRide.createdAt), 'p')}
                      </DetailValue>
                    </div>
                  </DetailItem>
                  
                  <DetailItem>
                    <FaMapMarkerAlt />
                    <div>
                      <DetailLabel>From</DetailLabel>
                      <DetailValue>
                        {selectedRide.route && selectedRide.route.coordinates ? 
                          getLocationName(selectedRide.route.coordinates[0]) : 
                          (selectedRide.route?.from || 'Starting point')}
                      </DetailValue>
                    </div>
                  </DetailItem>
                  
                  <DetailItem>
                    <FaMapMarkerAlt />
                    <div>
                      <DetailLabel>To</DetailLabel>
                      <DetailValue>
                        {selectedRide.route && selectedRide.route.coordinates ? 
                          getLocationName(selectedRide.route.coordinates[1]) : 
                          (selectedRide.route?.to || 'Destination')}
                      </DetailValue>
                    </div>
                  </DetailItem>
                </DetailSection>
                
                <DetailSection>
                  <SectionTitle>Passenger Information</SectionTitle>
                  {selectedRide.rideRequests && selectedRide.rideRequests.length > 0 ? (
                    <PassengerList>
                      {selectedRide.rideRequests.map((request) => (
                        <PassengerItem key={request._id}>
                          <PassengerName>
                            {request.passenger?.name || 'Passenger'}
                          </PassengerName>
                          <PassengerDetail>
                            <span>Seats: {request.seatsRequested || 1}</span>
                            <span>Fare: PKR {selectedRide.pricePerSeat * (request.seatsRequested || 1)}</span>
                          </PassengerDetail>
                        </PassengerItem>
                      ))}
                    </PassengerList>
                  ) : (
                    <NoPassengersMessage>No passengers for this ride</NoPassengersMessage>
                  )}
                </DetailSection>
                
                <DetailSection>
                  <SectionTitle>Ratings & Feedback</SectionTitle>
                  {selectedRide.ratings && selectedRide.ratings.length > 0 ? (
                    <>
                      <RatingSummary>
                        <AverageRating>
                          {calculateAverageRating(selectedRide)}
                          <FaStar color="#FFD700" size={24} />
                        </AverageRating>
                        <RatingCount>{selectedRide.ratings.length} ratings</RatingCount>
                      </RatingSummary>
                      
                      <RatingsList>
                        {selectedRide.ratings.map((rating) => (
                          <RatingItem key={rating._id}>
                            <RatingHeader>
                              <RatingUser>
                                {rating.passenger?.name || 'Passenger'}
                              </RatingUser>
                              <RatingValue>
                                {rating.rating} <FaStar color="#FFD700" />
                              </RatingValue>
                            </RatingHeader>
                            {rating.feedback && (
                              <RatingFeedback>"{rating.feedback}"</RatingFeedback>
                            )}
                          </RatingItem>
                        ))}
                      </RatingsList>
                    </>
                  ) : (
                    <NoRatingsMessage>No ratings for this ride yet</NoRatingsMessage>
                  )}
                </DetailSection>
                
                <TotalSection>
                  <TotalLabel>Total Fare Collected</TotalLabel>
                  <TotalValue>PKR {calculateTotalFare(selectedRide)}</TotalValue>
                </TotalSection>
              </ModalContent>
            </RideDetailModal>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  padding: 2rem;
  color: #fff;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(45deg, #ff00ff, #ff8800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  border-top: 4px solid #ff00ff;
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

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
`;

const RideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const RideCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: #ff00ff;
  }
`;

const RideDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #ff00ff;
`;

const RideInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 0.75rem 0;
  
  svg {
    color: #4ade80;
    margin-top: 3px;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 1rem 0;
  font-weight: 500;
  
  span:first-child {
    font-size: 1.2rem;
  }
`;

const ViewButton = styled.button`
  width: 100%;
  background: rgba(255, 0, 255, 0.1);
  color: #ff00ff;
  border: 1px solid rgba(255, 0, 255, 0.3);
  border-radius: 6px;
  padding: 0.75rem;
  margin-top: 1rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 0, 255, 0.2);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const RideDetailModal = styled(motion.div)`
  background: rgb(20, 30, 40);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: rgb(20, 30, 40);
  z-index: 1;
  
  h2 {
    margin: 0;
    color: white;
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

const DetailSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #ff00ff;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin: 1rem 0;
  
  svg {
    color: #4ade80;
    margin-top: 0.25rem;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

const DetailValue = styled.div`
  color: white;
`;

const PassengerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PassengerItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
`;

const PassengerName = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const PassengerDetail = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const NoPassengersMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.5);
`;

const RatingSummary = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const AverageRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.8rem;
  font-weight: bold;
`;

const RatingCount = styled.div`
  color: rgba(255, 255, 255, 0.6);
`;

const RatingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RatingItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
`;

const RatingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const RatingUser = styled.div`
  font-weight: 500;
`;

const RatingValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const RatingFeedback = styled.div`
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
`;

const NoRatingsMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.5);
`;

const TotalSection = styled.div`
  background: rgba(255, 0, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
`;

const TotalValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff00ff;
`;

export default RideHistory; 