import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaUser, FaPhone, FaVenusMars, FaCheck, FaTimes, FaClock, FaUsers } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
  color: #fff;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#4ade80' : 'transparent'};
  border-radius: 8px;
  color: ${props => props.active ? '#4ade80' : '#fff'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 222, 128, 0.1);
  }
`;

const RequestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const RequestCard = styled(motion.div)`
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(74, 222, 128, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(74, 222, 128, 0.05) 0%, 
      rgba(74, 222, 128, 0) 50%);
    pointer-events: none;
  }
`;

const PassengerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4ade80, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #4ade80;
  font-weight: 600;
  color: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '${props => getInitials(props.name)}';
    font-size: 1.25rem;
  }
`;

const InfoText = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #fff;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0;
  
  svg {
    color: #4ade80;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &.accept {
    background: rgba(74, 222, 128, 0.2);
    color: #4ade80;
    &:hover {
      background: rgba(74, 222, 128, 0.3);
    }
  }

  &.reject {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    &:hover {
      background: rgba(239, 68, 68, 0.3);
    }
  }
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  background: ${props => {
    switch (props.status) {
      case 'Pending':
        return 'rgba(251, 191, 36, 0.2)';
      case 'Accepted':
        return 'rgba(74, 222, 128, 0.2)';
      case 'Rejected':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Pending':
        return '#fbbf24';
      case 'Accepted':
        return '#4ade80';
      case 'Rejected':
        return '#ef4444';
      default:
        return '#fff';
    }
  }};
`;

const Passengers = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ride-requests/driver', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch requests');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ride-requests/${requestId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }

      const data = await response.json();
      if (data.success) {
        // Refresh the requests list
        fetchRequests();
      } else {
        throw new Error(data.message || `Failed to ${action} request`);
      }
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      alert(err.message);
    }
  };

  const filteredRequests = requests.filter(request => {
    switch (activeTab) {
      case 'pending':
        return request.status === 'Pending';
      case 'accepted':
        return request.status === 'Accepted';
      case 'rejected':
        return request.status === 'Rejected';
      default:
        return true;
    }
  });

  if (loading) {
    return <Container>Loading requests...</Container>;
  }

  if (error) {
    return <Container>Error: {error}</Container>;
  }

  return (
    <Container>
      <TabContainer>
        <Tab 
          active={activeTab === 'pending'} 
          onClick={() => setActiveTab('pending')}
        >
          Pending Requests
        </Tab>
        <Tab 
          active={activeTab === 'accepted'} 
          onClick={() => setActiveTab('accepted')}
        >
          Accepted Requests
        </Tab>
        <Tab 
          active={activeTab === 'rejected'} 
          onClick={() => setActiveTab('rejected')}
        >
          Rejected Requests
        </Tab>
      </TabContainer>

      <RequestGrid>
        <AnimatePresence>
          {filteredRequests.map(request => (
            <RequestCard
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StatusBadge status={request.status}>
                {request.status}
              </StatusBadge>

              <PassengerInfo>
                <Avatar name={request.passenger.name} />
                <InfoText>
                  <Name>{request.passenger.name}</Name>
                  <DetailItem>
                    <FaPhone /> {request.passenger.phoneNumber}
                  </DetailItem>
                  <DetailItem>
                    <FaVenusMars /> {request.passenger.gender}
                  </DetailItem>
                </InfoText>
              </PassengerInfo>

              <DetailItem>
                <FaUsers /> Seats Requested: {request.seatsRequested}
              </DetailItem>
              <DetailItem>
                <FaClock /> Requested on: {format(new Date(request.createdAt), 'PPp')}
              </DetailItem>

              {request.status === 'Pending' && (
                <ActionButtons>
                  <Button
                    className="accept"
                    onClick={() => handleAction(request._id, 'accept')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaCheck /> Accept
                  </Button>
                  <Button
                    className="reject"
                    onClick={() => handleAction(request._id, 'reject')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTimes /> Reject
                  </Button>
                </ActionButtons>
              )}
            </RequestCard>
          ))}
        </AnimatePresence>
      </RequestGrid>
    </Container>
  );
};

const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

export default Passengers; 