import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaFilter } from 'react-icons/fa';
import { format } from 'date-fns';
import RouteMap from '../maps/RouteMap';
import { reverseGeocodeWithDelay } from '../../utils/geocoding';

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
  background: linear-gradient(135deg,rgb(49, 89, 85) 0%,rgb(31, 84, 78) 100%);
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

// NEW: Filter menu and input styles
const FilterMenu = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: #fff;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  color: #333;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  color: #333;
`;

// NEW: Details container for Price and Seats display
const DetailsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
`;

const PriceTag = styled.div`
  background: rgba(74, 222, 128, 0.2);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  color: #4ade80;
  font-size: 0.9rem;
`;

const SeatsTag = styled.div`
  background: rgba(59, 130, 246, 0.2);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  color: #3b82f6;
  font-size: 0.9rem;
`;

const ScheduledRides = ({ onRideSelect }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW filter states
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterSeats, setFilterSeats] = useState('');
  const [filterPreference, setFilterPreference] = useState('No Preference');
  const [filterDate, setFilterDate] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterPrice, setFilterPrice] = useState('');

  const [locationNames, setLocationNames] = useState({});

  useEffect(() => {
    fetchRides();
  }, []);

  useEffect(() => {
    const fetchLocationNames = async () => {
      const newLocationNames = {};
      const uniqueLocations = new Set();
      
      // Collect all unique coordinates from rides
      rides.forEach(ride => {
        if (ride.route?.coordinates) {
          uniqueLocations.add(`${ride.route.coordinates[0][1]},${ride.route.coordinates[0][0]}`);
          uniqueLocations.add(`${ride.route.coordinates[1][1]},${ride.route.coordinates[1][0]}`);
        }
      });

      // Filter out coordinates we already have
      const locationsToFetch = Array.from(uniqueLocations)
        .filter(coordKey => !locationNames[coordKey]);

      // Fetch in parallel with a maximum of 4 concurrent requests
      const batchSize = 4;
      for (let i = 0; i < locationsToFetch.length; i += batchSize) {
        const batch = locationsToFetch.slice(i, i + batchSize);
        const promises = batch.map(coordKey => {
          const [lat, lng] = coordKey.split(',').map(Number);
          return reverseGeocodeWithDelay(lat, lng)
            .then(name => ({ coordKey, name }))
            .catch(() => ({ coordKey, name: coordKey }));
        });

        const results = await Promise.all(promises);
        results.forEach(({ coordKey, name }) => {
          newLocationNames[coordKey] = name;
        });
      }

      if (Object.keys(newLocationNames).length > 0) {
        setLocationNames(prev => ({ ...prev, ...newLocationNames }));
      }
    };

    if (rides.length > 0) {
      fetchLocationNames();
    }
  }, [rides]);

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

  // NEW: Compute filtered rides based on new filters
  const filteredRides = rides.filter(ride => {
    let valid = true;

    if (filterSeats) {
      valid = valid && ride.availableSeats >= parseInt(filterSeats);
    }
    if (filterPreference && filterPreference !== 'No Preference') {
      // Assumes each ride has a "preference" field (e.g., 'Male' or 'Female')
      valid = valid && ride.preference && ride.preference.toLowerCase() === filterPreference.toLowerCase();
    }
    if (filterDate) {
      const rideDate = new Date(ride.schedule[0].departureTime).toISOString().split('T')[0];
      valid = valid && (rideDate === filterDate);
    }
    if (filterMinPrice) {
      valid = valid && ride.pricePerSeat >= parseFloat(filterMinPrice);
    }
    if (filterPrice) {
      valid = valid && ride.pricePerSeat <= parseFloat(filterPrice);
    }

    return valid;
  });

  useEffect(() => {
    const fetchLocationNames = async () => {
      const newLocationNames = {};
      const uniqueLocations = new Set();
      
      // First collect all unique coordinates
      filteredRides.forEach(ride => {
        const coords = ride.route.coordinates;
        uniqueLocations.add(`${coords[0][1]},${coords[0][0]}`);
        uniqueLocations.add(`${coords[1][1]},${coords[1][0]}`);
      });

      // Filter out coordinates we already have
      const locationsToFetch = Array.from(uniqueLocations)
        .filter(coordKey => !locationNames[coordKey]);

      // Fetch in parallel with a maximum of 4 concurrent requests
      const batchSize = 4;
      for (let i = 0; i < locationsToFetch.length; i += batchSize) {
        const batch = locationsToFetch.slice(i, i + batchSize);
        const promises = batch.map(coordKey => {
          const [lat, lng] = coordKey.split(',').map(Number);
          return reverseGeocodeWithDelay(lat, lng)
            .then(name => ({ coordKey, name }))
            .catch(() => ({ coordKey, name: coordKey }));
        });

        const results = await Promise.all(promises);
        results.forEach(({ coordKey, name }) => {
          newLocationNames[coordKey] = name;
        });
      }

      if (Object.keys(newLocationNames).length > 0) {
        setLocationNames(prev => ({ ...prev, ...newLocationNames }));
      }
    };

    fetchLocationNames();
  }, [filteredRides]);

  const handleRideClick = (ride) => {
    if (typeof onRideSelect === 'function') {
      onRideSelect(ride);
    }
    // Optionally, you could scroll or add transition effects here.
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <Title>Scheduled Rides</Title>
        <FilterButton onClick={() => setShowFilterMenu(!showFilterMenu)}>
          <FaFilter /> Filters
        </FilterButton>
      </Header>

      {showFilterMenu && (
        <FilterMenu>
          <div>
            <FilterLabel>Seats:</FilterLabel>
            <FilterInput
              type="number"
              placeholder="Min Seats"
              value={filterSeats}
              onChange={e => setFilterSeats(e.target.value)}
            />
          </div>
          <div>
            <FilterLabel>Preference:</FilterLabel>
            <FilterSelect
              value={filterPreference}
              onChange={e => setFilterPreference(e.target.value)}
            >
              <option>No Preference</option>
              <option>Male</option>
              <option>Female</option>
            </FilterSelect>
          </div>
          <div>
            <FilterLabel>Date:</FilterLabel>
            <FilterInput
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
          </div>
          <div>
            <FilterLabel>Min Price:</FilterLabel>
            <FilterInput
              type="number"
              placeholder="Min Price"
              value={filterMinPrice}
              onChange={e => setFilterMinPrice(e.target.value)}
            />
          </div>
          <div>
            <FilterLabel>Max Price:</FilterLabel>
            <FilterInput
              type="number"
              placeholder="Max Price"
              value={filterPrice}
              onChange={e => setFilterPrice(e.target.value)}
            />
          </div>
          <FilterButton onClick={() => setShowFilterMenu(false)}>
            Apply
          </FilterButton>
          <FilterButton onClick={() => {
            setFilterSeats('');
            setFilterPreference('No Preference');
            setFilterDate('');
            setFilterMinPrice('');
            setFilterPrice('');
          }}>
            Clear Filters
          </FilterButton>
        </FilterMenu>
      )}

      <RideGrid>
        <AnimatePresence>
          {filteredRides.map(ride => {
            // NEW: Compute start and end points from the ride coordinates
            const startPoint = {
              lat: ride.route.coordinates[0][1],
              lng: ride.route.coordinates[0][0]
            };
            const endPoint = {
              lat: ride.route.coordinates[1][1],
              lng: ride.route.coordinates[1][0]
            };

            return (
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

                {/* 
                  Updated: Render the map preview using RouteMap.
                  We pass readOnly and a height prop (small height for preview) 
                */}
                <RoutePreview>
                  <RouteMap 
                    startPoint={startPoint} 
                    endPoint={endPoint} 
                    readOnly 
                    height="100px" 
                  />
                </RoutePreview>

                <RideInfo>
                  <FaMapMarkerAlt />
                  <div>
                    <div>
                      From: {
                        locationNames[`${ride.route.coordinates[0][1]},${ride.route.coordinates[0][0]}`] || 
                        `${ride.route.coordinates[0][1].toFixed(6)}, ${ride.route.coordinates[0][0].toFixed(6)}`
                      }
                    </div>
                    <div>
                      To: {
                        locationNames[`${ride.route.coordinates[1][1]},${ride.route.coordinates[1][0]}`] || 
                        `${ride.route.coordinates[1][1].toFixed(6)}, ${ride.route.coordinates[1][0].toFixed(6)}`
                      }
                    </div>
                  </div>
                </RideInfo>

                <DetailsContainer>
                  <PriceTag>PKR {ride.pricePerSeat}</PriceTag>
                  <SeatsTag>Min Seats: {ride.availableSeats}</SeatsTag>
                </DetailsContainer>
              </RideCard>
            );
          })}
        </AnimatePresence>
      </RideGrid>
    </PageContainer>
  );
};

export default ScheduledRides; 