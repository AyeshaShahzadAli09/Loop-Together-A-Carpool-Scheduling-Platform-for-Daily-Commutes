import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

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

const ModalContent = styled(motion.div)`
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  
  &:hover {
    color: #ff4444;
  }
`;

const Title = styled.h2`
  color: #4ade80;
  margin-bottom: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #fff;
  margin-bottom: 1rem;
`;

const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DocumentImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: bold;
  background: ${props => {
    if (props.disabled) return '#808080';
    return props.variant === 'approve' ? '#4ade80' : '#ff4444';
  }};
  color: white;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const Feedback = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  margin-top: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4ade80;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #fff;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  padding: 2rem;
`;

const VerificationDetails = ({ verification, onClose, onStatusUpdate }) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailedVerification, setDetailedVerification] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchVerificationDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/verifications/${verification._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch verification details');
        }

        const data = await response.json();
        setDetailedVerification(data.verification);
      } catch (error) {
        console.error('Error fetching verification details:', error);
        setFetchError(error.message);
      }
    };

    fetchVerificationDetails();
  }, [verification._id]);

  const handleStatusUpdate = async (status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/verifications/${verification._id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status, feedback })
        }
      );

      if (!response.ok) throw new Error('Failed to update status');

      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) {
    return (
      <ModalOverlay>
        <ModalContent>
          <ErrorMessage>Error: {fetchError}</ErrorMessage>
          <Button onClick={onClose}>Close</Button>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (!detailedVerification) {
    return (
      <ModalOverlay>
        <ModalContent>
          <LoadingSpinner>Loading...</LoadingSpinner>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContent>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title>Verification Request Details</Title>

        <Section>
          <SectionTitle>User Information</SectionTitle>
          <p>Name: {detailedVerification.user.name}</p>
          <p>Email: {detailedVerification.user.email}</p>
          <p>Driver License: {detailedVerification.user.driverLicense}</p>
          <p>Vehicle Plate: {detailedVerification.user.vehiclePlate}</p>
        </Section>

        <Section>
          <SectionTitle>Documents</SectionTitle>
          <ImageContainer>
            {detailedVerification.documents.map((doc, index) => (
              <DocumentImage
                key={index}
                src={doc.url}
                alt={doc.type}
                onClick={() => window.open(doc.url, '_blank')}
              />
            ))}
          </ImageContainer>
        </Section>

        <Section>
          <SectionTitle>Feedback</SectionTitle>
          <Feedback
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter feedback for the user..."
          />
        </Section>

        <ActionButtons>
          <Button
            variant="approve"
            onClick={() => handleStatusUpdate('Approved')}
            disabled={loading || detailedVerification.status !== 'Pending'}
            whileHover={{ scale: detailedVerification.status === 'Pending' ? 1.05 : 1 }}
            whileTap={{ scale: detailedVerification.status === 'Pending' ? 0.95 : 1 }}
          >
            {detailedVerification.status === 'Approved' ? 'Already Approved' : 'Approve'}
          </Button>
          <Button
            variant="reject"
            onClick={() => handleStatusUpdate('Rejected')}
            disabled={loading || detailedVerification.status !== 'Pending'}
            whileHover={{ scale: detailedVerification.status === 'Pending' ? 1.05 : 1 }}
            whileTap={{ scale: detailedVerification.status === 'Pending' ? 0.95 : 1 }}
          >
            {detailedVerification.status === 'Rejected' ? 'Already Rejected' : 'Reject'}
          </Button>
        </ActionButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default VerificationDetails; 