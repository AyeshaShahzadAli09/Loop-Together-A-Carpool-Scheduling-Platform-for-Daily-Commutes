import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCar, FaStar, FaUser, FaMoneyBillWave } from 'react-icons/fa';
import { format } from 'date-fns';
import axios from 'axios';
import { apiRequest } from '../../config';
import { toast } from 'react-hot-toast';
import { reverseGeocodeWithDelay } from '../../utils/geocoding';

const RideHistory = () => {
  const [completedRides, setCompletedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [locationNames, setLocationNames] = useState({});
  const [hoverRating, setHoverRating] = useState(0);

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
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('rides/user/history'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCompletedRides(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch ride history:', err);
      setError('Failed to load your ride history. Please try again.');
      setLoading(false);
    }
  };

  const fetchLocationNames = async () => {
    try {
      const newLocationNames = {};
      const uniqueLocations = new Set();
      
      // Collect all unique coordinates from rides
      completedRides.forEach(ride => {
        if (ride.carpool?.route?.coordinates) {
          const coords = ride.carpool.route.coordinates;
          uniqueLocations.add(`${coords[0][1]},${coords[0][0]}`);
          uniqueLocations.add(`${coords[1][1]},${coords[1][0]}`);
        }
      });

      // Filter out coordinates we already have
      const locationsToFetch = Array.from(uniqueLocations)
        .filter(coordKey => !locationNames[coordKey]);

      // Fetch in batches
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
    setRating(0);
    setFeedback('');
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedRide(null);
    setShowRatingModal(false);
  };

  const handleRateRide = () => {
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error('Please select a rating before submitting');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(
        apiRequest(`rides/rate/${selectedRide.carpool._id}`),
        { rating, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Rating submitted successfully');
      
      // Update the local state
      setCompletedRides(prev => 
        prev.map(ride => 
          ride._id === selectedRide._id 
            ? { ...ride, rated: true, userRating: { rating, feedback } } 
            : ride
        )
      );
      
      // Close the rating modal
      setShowRatingModal(false);
      
      // Close the entire details modal after a short delay
      setTimeout(() => {
        handleCloseDetails();
      }, 1500);
    } catch (err) {
      console.error('Failed to submit rating:', err);
      if (err.response?.data?.message === 'You have already rated this ride') {
        toast.error('You have already rated this ride');
      } else {
        toast.error('Failed to submit rating. Please try again.');
      }
    }
  };

  const hasUserRatedRide = (ride) => {
    return ride.rated || (ride.userRating && ride.userRating.rating > 0);
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Ride History</Title>
        </Header>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading your ride history...</p>
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
        <EmptyMessage>You don't have any completed rides yet.</EmptyMessage>
      ) : (
        <RideGrid>
          {completedRides.map(ride => {
            const startingPoint = ride.carpool?.route?.coordinates ? 
              getLocationName(ride.carpool.route.coordinates[0]) : 
              (ride.carpool?.route?.from || 'Unknown location');
            
            const destination = ride.carpool?.route?.coordinates ? 
              getLocationName(ride.carpool.route.coordinates[1]) : 
              (ride.carpool?.route?.to || 'Unknown location');
            
            return (
              <RideCard 
                key={ride._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleViewDetails(ride)}
              >
                <RideDate>
                  <FaCalendarAlt />
                  <span>{format(new Date(ride.createdAt), 'PP')}</span>
                </RideDate>
                
                <RideInfo>
                  <FaClock />
                  <p>{format(new Date(ride.createdAt), 'p')}</p>
                </RideInfo>
                
                <RideInfo>
                  <FaMapMarkerAlt />
                  <div>
                    <div><strong>From:</strong> {startingPoint}</div>
                    <div><strong>To:</strong> {destination}</div>
                  </div>
                </RideInfo>
                
                <RideInfo>
                  <FaCar />
                  <p>{ride.carpool?.vehicleType} ({ride.carpool?.vehicleModel})</p>
                </RideInfo>
                
                <RideInfo>
                  <FaUser />
                  <p>Driver: {ride.carpool?.driver?.name || 'Unknown'}</p>
                </RideInfo>
                
                {ride.userRating ? (
                  <RatingInfo>
                    <div>Your Rating: {ride.userRating.rating}/5</div>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FaStar 
                          key={star} 
                          color={star <= ride.userRating.rating ? '#FFD700' : '#aaa'}
                        />
                      ))}
                    </div>
                  </RatingInfo>
                ) : (
                  <RateButton>
                    Rate this ride
                  </RateButton>
                )}
              </RideCard>
            );
          })}
        </RideGrid>
      )}

      {/* Ride Detail Modal */}
      <AnimatePresence>
        {showDetails && selectedRide && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DetailsModal
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <h2>Ride Details</h2>
                <CloseButton onClick={handleCloseDetails}>×</CloseButton>
              </ModalHeader>
              
              <ModalContent>
                <Section>
                  <SectionTitle>Route Information</SectionTitle>
                  <DetailItem>
                    <FaCalendarAlt />
                    <div>
                      <DetailLabel>Date</DetailLabel>
                      <DetailValue>
                        {format(new Date(selectedRide.createdAt), 'PPP')}
                      </DetailValue>
                    </div>
                  </DetailItem>
                  
                  <DetailItem>
                    <FaClock />
                    <div>
                      <DetailLabel>Time</DetailLabel>
                      <DetailValue>
                        {format(new Date(selectedRide.createdAt), 'p')}
                      </DetailValue>
                    </div>
                  </DetailItem>
                  
                  <DetailItem>
                    <FaMapMarkerAlt />
                    <div>
                      <DetailLabel>From</DetailLabel>
                      <DetailValue>
                        {selectedRide.carpool?.route?.coordinates ? 
                          getLocationName(selectedRide.carpool.route.coordinates[0]) : 
                          (selectedRide.carpool?.route?.from || 'Unknown location')}
                      </DetailValue>
                    </div>
                  </DetailItem>
                  
                  <DetailItem>
                    <FaMapMarkerAlt />
                    <div>
                      <DetailLabel>To</DetailLabel>
                      <DetailValue>
                        {selectedRide.carpool?.route?.coordinates ? 
                          getLocationName(selectedRide.carpool.route.coordinates[1]) : 
                          (selectedRide.carpool?.route?.to || 'Unknown location')}
                      </DetailValue>
                    </div>
                  </DetailItem>
                </Section>
                
                <Section>
                  <SectionTitle>Ride Information</SectionTitle>
                  <DetailItem>
                    <FaCar />
                    <div>
                      <DetailLabel>Vehicle</DetailLabel>
                      <DetailValue>
                        {selectedRide.carpool?.vehicleType} ({selectedRide.carpool?.vehicleModel})
                      </DetailValue>
                    </div>
                  </DetailItem>
                  
                  <DetailItem>
                    <FaUser />
                    <div>
                      <DetailLabel>Driver</DetailLabel>
                      <DetailValue>
                        {selectedRide.carpool?.driver?.name || 'Unknown'}
                      </DetailValue>
                    </div>
                  </DetailItem>
                  
                  <DetailItem>
                    <FaMoneyBillWave />
                    <div>
                      <DetailLabel>Fare</DetailLabel>
                      <DetailValue>
                        PKR {selectedRide.carpool?.pricePerSeat * (selectedRide.seatsRequested || 1)}
                      </DetailValue>
                    </div>
                  </DetailItem>
                </Section>

                {!showRatingModal && (
                  <ActionSection>
                    {hasUserRatedRide(selectedRide) ? (
                      <YourRating>
                        <RatingLabel>Your Rating</RatingLabel>
                        <StarsDisplay>
                          {[1, 2, 3, 4, 5].map(star => (
                            <FaStar 
                              key={star} 
                              color={star <= (selectedRide.userRating?.rating || 0) ? '#FFD700' : '#aaa'} 
                              size={24}
                            />
                          ))}
                        </StarsDisplay>
                        {selectedRide.userRating?.feedback && (
                          <FeedbackDisplay>
                            <p>Your feedback:</p>
                            <q>{selectedRide.userRating.feedback}</q>
                          </FeedbackDisplay>
                        )}
                      </YourRating>
                    ) : (
                      <RateRideButton onClick={handleRateRide}>
                        Rate This Ride
                      </RateRideButton>
                    )}
                  </ActionSection>
                )}

                {/* Rating Modal */}
                {showRatingModal && (
                  <RatingForm>
                    <h3>Rate Your Experience</h3>
                    <StarRating>
                      {[1, 2, 3, 4, 5].map(star => (
                        <StarIcon 
                          key={star}
                          active={star <= (hoverRating || rating)}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <FaStar size={32} />
                        </StarIcon>
                      ))}
                    </StarRating>
                    <RatingLabel>
                      {rating === 1 && 'Poor'}
                      {rating === 2 && 'Fair'}
                      {rating === 3 && 'Good'}
                      {rating === 4 && 'Very Good'}
                      {rating === 5 && 'Excellent'}
                    </RatingLabel>
                    
                    <FeedbackField
                      placeholder="Share your experience (optional)"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                    
                    <RatingActions>
                      <CancelButton onClick={() => setShowRatingModal(false)}>
                        Cancel
                      </CancelButton>
                      <SubmitButton onClick={handleSubmitRating}>
                        Submit Rating
                      </SubmitButton>
                    </RatingActions>
                  </RatingForm>
                )}
              </ModalContent>
            </DetailsModal>
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
  background: linear-gradient(45deg, #00ffff, #4ade80);
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
  border-top: 4px solid #00ffff;
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
    border-color: #00ffff;
  }
`;

const RideDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #00ffff;
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

const RatingInfo = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  .stars {
    display: flex;
    gap: 0.2rem;
    margin-top: 0.5rem;
  }
`;

const RateButton = styled.button`
  width: 100%;
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 6px;
  padding: 0.75rem;
  margin-top: 1rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 255, 255, 0.2);
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

const DetailsModal = styled(motion.div)`
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

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #00ffff;
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

const ActionSection = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
`;

const RateRideButton = styled.button`
  background: linear-gradient(135deg, #00ffff, #4ade80);
  color: #042f2e;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 255, 0.4);
  }
`;

const RatingForm = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  
  h3 {
    margin: 0 0 1.5rem;
    text-align: center;
    color: #00ffff;
  }
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StarIcon = styled.div`
  cursor: pointer;
  color: ${props => props.active ? '#FFD700' : '#aaa'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const RatingLabel = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
  color: #00ffff;
  height: 1.5rem;
`;

const FeedbackField = styled.textarea`
  width: 100%;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  margin-bottom: 1.5rem;
  resize: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: #00ffff;
  }
`;

const RatingActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #00ffff, #4ade80);
  color: #042f2e;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 255, 0.4);
  }
`;

const YourRating = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
`;

const StarsDisplay = styled.div`
  display: flex;
  gap: 0.3rem;
  margin: 1rem 0;
`;

const FeedbackDisplay = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  
  p {
    margin: 0 0 0.5rem;
    color: rgba(255, 255, 255, 0.6);
  }
  
  q {
    font-style: italic;
  }
`;

export default RideHistory; 