import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ListContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const RequestCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  color: #4ade80;
  margin: 0;
`;

const Email = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ status }) => {
    switch (status) {
      case 'Pending': return 'linear-gradient(45deg, #ffd700, #ffa500)';
      case 'Approved': return 'linear-gradient(45deg, #00ff00, #00cc00)';
      case 'Rejected': return 'linear-gradient(45deg, #ff4444, #cc0000)';
      default: return 'linear-gradient(45deg, #ffffff, #cccccc)';
    }
  }};
`;

const NoRequests = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
`;

const VerificationList = ({ onSelect, selectedId }) => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVerifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/verifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch verifications');

      const data = await response.json();
      setVerifications(data.verifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [selectedId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FaClock />;
      case 'Approved': return <FaCheckCircle />;
      case 'Rejected': return <FaTimesCircle />;
      default: return null;
    }
  };

  if (loading) return <ListContainer>Loading...</ListContainer>;
  if (error) return <ListContainer>Error: {error}</ListContainer>;

  return (
    <ListContainer>
      <AnimatePresence>
        {verifications.length > 0 ? (
          verifications.map((verification) => (
            <RequestCard
              key={verification._id}
              onClick={() => onSelect(verification)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserInfo>
                <Name>{verification.user.name}</Name>
                <Email>{verification.user.email}</Email>
              </UserInfo>
              <StatusBadge status={verification.status}>
                {getStatusIcon(verification.status)}
                {verification.status}
              </StatusBadge>
            </RequestCard>
          ))
        ) : (
          <NoRequests>No verification requests found</NoRequests>
        )}
      </AnimatePresence>
    </ListContainer>
  );
};

export default VerificationList; 