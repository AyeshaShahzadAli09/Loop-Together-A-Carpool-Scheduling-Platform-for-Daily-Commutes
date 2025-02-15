import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaFilter } from 'react-icons/fa';
import { format } from 'date-fns';

const PageContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #fff;
  margin: 0;
`;

const FiltersContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled(motion.button)`
  background: ${props => props.active ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? '#4ade80' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#4ade80' : '#fff'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(74, 222, 128, 0.3);
  }
`;

const RideInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: ${props => props.highlight ? '#4ade80' : '#fff'};
`;

const RoutePreview = styled.div`
  height: 100px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  background: ${props => {
    switch (props.status) {
      case 'upcoming': return 'rgba(74, 222, 128, 0.2)';
      case 'completed': return 'rgba(148, 163, 184, 0.2)';
      case 'cancelled': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'upcoming': return '#4ade80';
      case 'completed': return '#94a3b8';
      case 'cancelled': return '#ef4444';
      default: return '#fff';
    }
  }};
`;

const ScheduledRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(['upcoming']);
  const [selectedRide, setSelectedRide] = useState(null);

  useEffect(() => {
    fetchRides();
  }, [activeFilters]);

  const fetchRides = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/carpool', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setRides(data.data);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleRideClick = (ride) => {
    setSelectedRide(ride);
    // Navigate to ride details page
    // navigate(`/dashboard/driver/rides/${ride._id}`);
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <Title>Scheduled Rides</Title>
        <FilterButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFilter /> Filter
        </FilterButton>
      </Header>

      <FiltersContainer>
        {['upcoming', 'completed', 'cancelled'].map(filter => (
          <FilterButton
            key={filter}
            active={activeFilters.includes(filter)}
            onClick={() => toggleFilter(filter)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </FilterButton>
        ))}
      </FiltersContainer>

      <RideGrid>
        <AnimatePresence>
          {rides.map(ride => (
            <RideCard
              key={ride._id}
              onClick={() => handleRideClick(ride)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <StatusBadge status={ride.status}>
                {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
              </StatusBadge>
              
              <RideInfo highlight>
                <FaCalendarAlt />
                {format(new Date(ride.schedule[0].departureTime), 'PPP')}
              </RideInfo>
              
              <RideInfo>
                <FaClock />
                {format(new Date(ride.schedule[0].departureTime), 'p')}
              </RideInfo>

              <RoutePreview>
                {/* Add map preview here */}
              </RoutePreview>

              <RideInfo>
                <FaMapMarkerAlt />
                <div>
                  <div>From: {ride.route.coordinates[0][1].toFixed(6)}</div>
                  <div>To: {ride.route.coordinates[1][1].toFixed(6)}</div>
                </div>
              </RideInfo>

              <RideInfo>
                <FaUsers />
                {ride.availableSeats} seats available
              </RideInfo>
            </RideCard>
          ))}
        </AnimatePresence>
      </RideGrid>
    </PageContainer>
  );
};

export default ScheduledRides; 