import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaMapMarkerAlt, FaClock, FaComment } from 'react-icons/fa';

const ListContainer = styled.div`
  width: 300px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  overflow-y: auto;
`;

const RequestCard = styled(motion.div)`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  background: ${props => props.active ? 'rgba(255, 0, 255, 0.1)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.1);
`;

const Name = styled.span`
  font-weight: 500;
  color: #fff;
`;

const RouteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: rgba(255, 0, 255, 0.7);
  }
`;

const NoRequests = styled.div`
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
`;

const MessagePreview = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RideRequestList = ({ onSelectRide, isDriverMode }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isDriverMode) {
      fetchDriverChats();
    } else {
      fetchUserRequests();
    }
  }, [isDriverMode]);

  const fetchDriverChats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/chat/driver-chats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }

      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ride-requests/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ride requests');
      }

      const data = await response.json();
      if (data.success) {
        const acceptedRequests = data.data.filter(req => req.status === 'Accepted');
        setItems(acceptedRequests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = async (item) => {
    try {
      let chatData;
      
      if (isDriverMode) {
        // For drivers, the item is already a chat
        chatData = item;
      } else {
        // For users, initialize or get chat for the ride request
        const response = await fetch(`http://localhost:5000/api/chat/ride-request/${item._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to initialize chat');
        }

        const data = await response.json();
        if (!data.success) throw new Error('Failed to get chat data');
        chatData = data.data;
      }

      setSelectedItemId(item._id);
      onSelectRide(chatData);
    } catch (error) {
      console.error('Error selecting item:', error);
      alert('Failed to open chat. Please try again.');
    }
  };

  if (loading) {
    return <NoRequests>Loading...</NoRequests>;
  }

  if (items.length === 0) {
    return <NoRequests>
      {isDriverMode ? 'No messages found.' : 'No accepted ride requests found.'}
    </NoRequests>;
  }

  return (
    <ListContainer>
      <AnimatePresence>
        {items.map(item => (
          <RequestCard
            key={item._id}
            active={selectedItemId === item._id}
            onClick={() => handleSelectItem(item)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <UserInfo>
              <Avatar 
                src={isDriverMode
                  ? item.participants.find(p => p._id !== user._id)?.profilePicture
                  : item.carpool.driver.profilePicture
                } 
                alt="Profile" 
              />
              <Name>
                {isDriverMode
                  ? item.participants.find(p => p._id !== user._id)?.name
                  : item.carpool.driver.name
                }
              </Name>
            </UserInfo>
            {isDriverMode ? (
              <>
                <MessagePreview>
                  {item.lastMessage ? item.lastMessage.content : 'No messages yet'}
                </MessagePreview>
              </>
            ) : (
              <RouteInfo>
                <InfoRow>
                  <FaMapMarkerAlt />
                  <span>{item.carpool.route.startLocation} → {item.carpool.route.endLocation}</span>
                </InfoRow>
                <InfoRow>
                  <FaClock />
                  <span>{new Date(item.carpool.schedule.departureTime).toLocaleString()}</span>
                </InfoRow>
              </RouteInfo>
            )}
          </RequestCard>
        ))}
      </AnimatePresence>
    </ListContainer>
  );
};

export default RideRequestList; 