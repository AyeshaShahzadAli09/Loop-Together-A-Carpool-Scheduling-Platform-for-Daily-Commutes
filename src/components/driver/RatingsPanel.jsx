import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaQuoteLeft } from 'react-icons/fa';
import axios from 'axios';
import { API_URL, apiRequest } from '../../config';
import { format } from 'date-fns';

const RatingsPanel = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    count: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('rides/ratings'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const ratingData = response.data.data;
      setRatings(ratingData);
      
      // Calculate statistics
      if (ratingData.length > 0) {
        const total = ratingData.reduce((sum, r) => sum + r.rating, 0);
        const avg = total / ratingData.length;
        
        // Calculate distribution
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingData.forEach(r => {
          dist[r.rating] = (dist[r.rating] || 0) + 1;
        });
        
        setStats({
          average: avg,
          count: ratingData.length,
          distribution: dist
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setLoading(false);
    }
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <Title>My Ratings & Reviews</Title>
      </Header>

      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading your ratings...</p>
        </LoadingContainer>
      ) : (
        <>
          <StatsSection>
            <OverallRating>
              <AverageRating>{stats.average.toFixed(1)}</AverageRating>
              <StarContainer>
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar 
                    key={star}
                    color={star <= Math.round(stats.average) ? '#FFD700' : 'rgba(255,255,255,0.2)'}
                    size={24}
                  />
                ))}
              </StarContainer>
              <RatingsCount>from {stats.count} ratings</RatingsCount>
            </OverallRating>
            
            <RatingDistribution>
              {[5, 4, 3, 2, 1].map(star => (
                <DistributionRow key={star}>
                  <StarLabel>
                    {star} <FaStar color="#FFD700" size={14} />
                  </StarLabel>
                  <ProgressBarContainer>
                    <ProgressBar 
                      width={stats.count > 0 ? (stats.distribution[star] / stats.count) * 100 : 0}
                    />
                  </ProgressBarContainer>
                  <CountLabel>{stats.distribution[star] || 0}</CountLabel>
                </DistributionRow>
              ))}
            </RatingDistribution>
          </StatsSection>

          <RatingsList>
            <RatingsTitle>Recent Reviews</RatingsTitle>
            
            {ratings.length === 0 ? (
              <EmptyState>
                <EmptyMessage>No ratings yet</EmptyMessage>
                <EmptySubMessage>
                  Ratings from passengers will appear here after they rate their rides with you
                </EmptySubMessage>
              </EmptyState>
            ) : (
              <AnimatePresence>
                {ratings.map((rating) => (
                  <RatingCard
                    key={rating._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <RatingHeader>
                      <RatingStars>
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar 
                            key={star}
                            color={star <= rating.rating ? '#FFD700' : 'rgba(255,255,255,0.2)'}
                            size={16}
                          />
                        ))}
                      </RatingStars>
                      <RatingDate>
                        {format(new Date(rating.createdAt), 'MMM d, yyyy')}
                      </RatingDate>
                    </RatingHeader>
                    
                    <RatingDetails>
                      <PassengerInfo>
                        <FaUser />
                        <span>{rating.passenger?.name || 'Anonymous'}</span>
                      </PassengerInfo>
                      
                      <RouteInfo>
                        <FaMapMarkerAlt />
                        <span>
                          {rating.carpool?.route?.from || 'Start'} to {rating.carpool?.route?.to || 'Destination'}
                        </span>
                      </RouteInfo>
                      
                      <TripDate>
                        <FaCalendarAlt />
                        <span>
                          {rating.carpool?.schedule?.length > 0 
                            ? format(new Date(rating.carpool.schedule[0].departureTime), 'PPP')
                            : 'Unknown date'}
                        </span>
                      </TripDate>
                    </RatingDetails>
                    
                    {rating.feedback && (
                      <FeedbackSection>
                        <FeedbackQuote>
                          <FaQuoteLeft />
                        </FeedbackQuote>
                        <FeedbackText>{rating.feedback}</FeedbackText>
                      </FeedbackSection>
                    )}
                  </RatingCard>
                ))}
              </AnimatePresence>
            )}
          </RatingsList>
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
  overflow-y: auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #fff;
  margin: 0;
`;

const StatsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const OverallRating = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 180px;
`;

const AverageRating = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: white;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  margin: 0.5rem 0;
`;

const RatingsCount = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const RatingDistribution = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
`;

const DistributionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StarLabel = styled.div`
  width: 40px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: white;
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const CountLabel = styled.div`
  width: 24px;
  text-align: right;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const RatingsList = styled.div`
  margin-top: 1rem;
`;

const RatingsTitle = styled.h3`
  font-size: 1.25rem;
  color: white;
  margin: 0 0 1.5rem 0;
`;

const RatingCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const RatingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const RatingDate = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const RatingDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PassengerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  
  svg {
    color: #4ade80;
  }
`;

const RouteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  
  svg {
    color: #4ade80;
  }
`;

const TripDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  
  svg {
    color: #4ade80;
  }
`;

const FeedbackSection = styled.div`
  position: relative;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const FeedbackQuote = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  color: rgba(255, 255, 255, 0.2);
`;

const FeedbackText = styled.p`
  margin: 0 0 0 1.5rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
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
  height: 200px;
  gap: 0.5rem;
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const EmptySubMessage = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin: 0;
`;

export default RatingsPanel; 