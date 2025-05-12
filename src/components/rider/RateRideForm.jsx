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
  const [success, setSuccess] = useState(false);

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
      
      toast.success('Thank you for your rating!', {
        duration: 3000
      });
      setSubmitting(false);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/rider/dashboard');
      }, 2000);
    } catch (error) {
      if (error.response?.data?.message === 'You have already rated this ride') {
        toast.error('You have already rated this ride');
        setTimeout(() => navigate('/rider/dashboard'), 1500);
      } else {
        toast.error('Failed to submit rating');
        console.error(error);
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return <LoadingContainer>Loading ride details...</LoadingContainer>;
  }

  if (success) {
    return (
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <SuccessContent>
          <SuccessIcon>
            <FaCheck />
          </SuccessIcon>
          <h2>Rating Submitted!</h2>
          <p>Thank you for your feedback.</p>
          <p>Redirecting to dashboard...</p>
        </SuccessContent>
      </Container>
    );
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
            {submitting ? (
              <>
                <LoadingSpinner /> Submitting...
              </>
            ) : (
              'Submit Rating'
            )}
          </SubmitButton>
        </RatingSection>
      </Content>
    </Container>
  );
};

// Styled components for success state
const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  color: white;
  
  h2 {
    margin: 1rem 0;
    font-size: 1.5rem;
  }
  
  p {
    margin: 0.5rem 0;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const SuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  font-size: 2rem;
  border: 2px solid rgba(74, 222, 128, 0.3);
`;

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

// Add a loading spinner
const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;


export default RateRideForm; 