import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const StatusContainer = styled(motion.div)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  position: relative;
  transform: none;
  left: auto;
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  svg {
    ${({ status }) => {
      switch (status) {
        case 'Pending':
          return 'color: #ffd700;'; // Gold
        case 'Approved':
          return 'color: #00ff00;'; // Green
        case 'Rejected':
          return 'color: #ff4444;'; // Red
        default:
          return 'color: #ffffff;'; // White
      }
    }}
    
    animation: ${({ status }) => 
      status === 'Pending' ? 'spin 2s linear infinite' : 'none'};
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #00ffff, #00ccff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Message = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  margin-top: 1rem;
  background: ${({ status }) => {
    switch (status) {
      case 'Pending':
        return 'linear-gradient(45deg, #ffd700, #ffa500)';
      case 'Approved':
        return 'linear-gradient(45deg, #00ff00, #00cc00)';
      case 'Rejected':
        return 'linear-gradient(45deg, #ff4444, #cc0000)';
      default:
        return 'linear-gradient(45deg, #ffffff, #cccccc)';
    }
  }};
`;

const Feedback = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-style: italic;
`;

const VerificationStatus = ({ status = 'Pending', feedback }) => {
  const getIcon = () => {
    switch (status) {
      case 'Pending':
        return <FaClock />;
      case 'Approved':
        return <FaCheckCircle />;
      case 'Rejected':
        return <FaTimesCircle />;
      default:
        return <FaSpinner />;
    }
  };

  const getMessage = () => {
    switch (status) {
      case 'Pending':
        return "Your driver verification request is being reviewed by our team. We'll notify you once the review is complete.";
      case 'Approved':
        return "Congratulations! Your driver verification has been approved. You can now start accepting ride requests.";
      case 'Rejected':
        return "Unfortunately, your driver verification request was not approved. Please review the feedback below and submit a new request.";
      default:
        return "Please submit your verification request to become a driver.";
    }
  };

  return (
    <StatusContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <IconWrapper status={status}>
        {getIcon()}
      </IconWrapper>
      <Title>Driver Verification Status</Title>
      <Message>{getMessage()}</Message>
      <StatusBadge status={status}>
        {status.toUpperCase()}
      </StatusBadge>
      {feedback && (
        <Feedback>
          <strong>Feedback:</strong> {feedback}
        </Feedback>
      )}
    </StatusContainer>
  );
};

export default VerificationStatus; 