import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCar, FaUsers } from 'react-icons/fa';
import RouteMap from '../maps/RouteMap';

const Container = styled(motion.div)`
  padding: 2rem;
  color: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
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

const RideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const RideCard = styled(motion.div)`
  background: linear-gradient(135deg,rgb(49, 89, 85) 0%,rgb(31, 84, 78) 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(74, 222, 128, 0.1);
  position: relative;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'Accepted': return 'rgba(74, 222, 128, 0.2)';
      case 'Rejected': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(251, 191, 36, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Accepted': return '#4ade80';
      case 'Rejected': return '#ef4444';
      default: return '#fbbf24';
    }
  }};
`;

const RideInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const MapPreview = styled.div`
  height: 150px;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
`;

const ScheduledRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRideRequests();
  }, []);

  const fetchRideRequests = async () => {
    try {
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
        setRides(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch ride requests');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ride requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRides = rides.filter(ride => {
    if (activeTab === 'all') return true;
    return ride.status.toLowerCase() === activeTab;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <Title>My Ride Requests</Title>
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All
        </Tab>
        <Tab 
          active={activeTab === 'pending'} 
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </Tab>
        <Tab 
          active={activeTab === 'accepted'} 
          onClick={() => setActiveTab('accepted')}
        >
          Accepted
        </Tab>
        <Tab 
          active={activeTab === 'rejected'} 
          onClick={() => setActiveTab('rejected')}
        >
          Rejected
        </Tab>
      </TabContainer>

      <RideGrid>
        <AnimatePresence>
          {filteredRides.map(request => (
            <RideCard
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StatusBadge status={request.status}>
                {request.status}
              </StatusBadge>

              <RideInfo>
                <FaCalendarAlt />
                {format(new Date(request.carpool.schedule[0].departureTime), 'PPP')}
              </RideInfo>

              <RideInfo>
                <FaClock />
                {format(new Date(request.carpool.schedule[0].departureTime), 'p')}
              </RideInfo>

              <MapPreview>
                <RouteMap
                  startPoint={{
                    lat: request.carpool.route.coordinates[0][1],
                    lng: request.carpool.route.coordinates[0][0]
                  }}
                  endPoint={{
                    lat: request.carpool.route.coordinates[1][1],
                    lng: request.carpool.route.coordinates[1][0]
                  }}
                  readOnly
                  height="150px"
                />
              </MapPreview>

              <RideInfo>
                <FaMapMarkerAlt />
                <div>
                  <div>From: {request.carpool.route.coordinates[0][1].toFixed(6)}</div>
                  <div>To: {request.carpool.route.coordinates[1][1].toFixed(6)}</div>
                </div>
              </RideInfo>

              <RideInfo>
                <FaCar />
                <div>{request.carpool.vehicleType} - {request.carpool.vehicleModel}</div>
              </RideInfo>

              <RideInfo>
                <FaUsers />
                <div>Seats Requested: {request.seatsRequested}</div>
              </RideInfo>
            </RideCard>
          ))}
        </AnimatePresence>
      </RideGrid>
    </Container>
  );
};

export default ScheduledRides; 