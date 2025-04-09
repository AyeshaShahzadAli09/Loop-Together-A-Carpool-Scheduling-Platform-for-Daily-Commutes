import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaCheck, FaTimes } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL, apiRequest } from '../../config';

const RateRideForm = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRideDetails();
  }, [rideId]);

  const fetchRideDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest(`rides/${rideId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRide(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load ride details');
      console.error(error);
      setLoading(false);
      navigate('/rider/dashboard');
    }
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('userToken');
      await axios.post(apiRequest(`rides/rate/${rideId}`), {
        rating,
        feedback
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Thank you for your rating!');
      navigate('/rider/dashboard');
    } catch (error) {
      toast.error('Failed to submit rating');
      console.error(error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading ride details...</LoadingContainer>;
  }

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <Title>Rate Your Ride</Title>
        <CloseButton onClick={() => navigate('/rider/dashboard')}>
          <FaTimes />
        </CloseButton>
      </Header>

      <Content>
        <RideInfo>
          <h3>Ride Details</h3>
          <p>From: {ride?.route?.from}</p>
          <p>To: {ride?.route?.to}</p>
          <p>Driver: {ride?.driver?.name}</p>
          <p>Date: {new Date(ride?.schedule?.date).toLocaleDateString()}</p>
        </RideInfo>

        <RatingSection>
          <h3>How was your experience?</h3>
          
          <StarRating>
            {[1, 2, 3, 4, 5].map(star => (
              <StarIcon 
                key={star}
                onClick={() => setRating(star)}
                filled={star <= rating}
              >
                {star <= rating ? <FaStar /> : <FaRegStar />}
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

          <FeedbackArea
            placeholder="Share your thoughts about the ride (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={500}
          />

          <SubmitButton 
            onClick={handleSubmitRating}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </SubmitButton>
        </RatingSection>
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
  max-width: 600px;
  margin: 2rem auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// ... Other styled components would follow, matching your app's design

export default RateRideForm; 