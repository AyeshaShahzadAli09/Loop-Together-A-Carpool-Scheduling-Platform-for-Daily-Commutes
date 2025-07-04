import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaDollarSign, FaArrowLeft, FaCar, FaFilter } from 'react-icons/fa';
import RouteMap from '../maps/RouteMap';
import { useAuth } from '../../context/AuthContext';
import SeatRequestModal from './SeatRequestModal';
import LocationDisplay from '../common/LocationDisplay';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL, apiRequest, getRideStatusForDisplay } from '../../config';

const Container = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: #fff;
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
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(74, 222, 128, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DriverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #4ade80;
  background: ${props => props.$bg || '#2d2d2d'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 1;
  }

  &::after {
    content: '${props => props.$fallback || ''}';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-weight: 500;
    z-index: 0;
  }
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  background: ${props => props.variant === 'seats' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(74, 222, 128, 0.2)'};
  color: ${props => props.variant === 'seats' ? '#3b82f6' : '#4ade80'};
`;

const RequestButton = styled.button`
  margin: 1rem auto 0;
  padding: 0.75rem 2rem;
  display: block;
  width: fit-content;
  background: linear-gradient(145deg, #4ade80, #38b673);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin: 1rem 0;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  
  svg {
    color: #4ade80;
    min-width: 16px;
  }
`;

const LocationDetails = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  
  p {
    margin: 0;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$hasSelection ? '1fr 400px' : '1fr'};
  gap: 2rem;
  transition: grid-template-columns 0.3s ease;
`;

const RideDetailsPanel = styled(motion.div)`
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
  border-left: 1px solid rgba(74, 222, 128, 0.1);
  padding: 2rem;
  height: calc(100vh - 4rem);
  position: sticky;
  top: 2rem;
  overflow-y: auto;
`;

const PanelHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4ade80;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;

  &:hover {
    background: rgba(74, 222, 128, 0.1);
  }
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MapContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  
  svg {
    color: #4ade80;
    font-size: 1.2rem;
  }
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Value = styled.div`
  font-weight: 500;
  margin-top: 0.25rem;
`;

const RouteDetails = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const Coordinate = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const ActionContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
`;

// NEW: Filter menu and input styles
const FilterMenu = styled.div`
  background: rgba(255, 255, 255, 0.05);
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

const FindRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedRide, setSelectedRide] = useState(null);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedRideDetails, setSelectedRideDetails] = useState(null);
  
  // NEW: Filter states
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterSeats, setFilterSeats] = useState('');
  const [filterGender, setFilterGender] = useState('No Preference');
  const [filterDate, setFilterDate] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');

  // Fetch available rides from the backend
  const fetchRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      // Update the API call to include both 'Scheduled' and 'Active' statuses
      const response = await axios.get(apiRequest('rides'), {
        params: {
          // Include both new and old status types to ensure all available rides are shown
          statuses: ['Scheduled', 'Active']
        },
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      // Process the rides to use the new status format
      const rides = response.data.data.map(ride => ({
        ...ride,
        displayStatus: getRideStatusForDisplay(ride.status)
      }));
      
      setRides(rides);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching available rides:', error);
      toast.error('Failed to load available rides');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  // Handle ride request submission. For simplicity, we use a prompt to ask for the number of seats.
  const handleRequest = async (ride) => {
    // Validation 1: Prevent self-requesting
    if (ride.driver._id === user._id) {
      alert('You cannot request your own ride');
      return;
    }

    // Validation 2: Check gender preference
    if (ride.preferredGender !== 'No Preference' && ride.preferredGender !== user.gender) {
      alert('This ride is only available for ' + ride.preferredGender);
      return;
    }

    // Open seat request modal instead of using prompt
    setSelectedRide(ride);
    setShowSeatModal(true);
  };

  // NEW: Apply filters to rides
  const filteredRides = rides.filter(ride => {
    let valid = true;

    if (filterSeats) {
      valid = valid && ride.availableSeats >= parseInt(filterSeats);
    }
    
    if (filterGender && filterGender !== 'No Preference') {
      valid = valid && ride.preferredGender && 
        (ride.preferredGender === filterGender || ride.preferredGender === 'No Preference');
    }
    
    if (filterDate) {
      const rideDate = new Date(ride.schedule[0].departureTime).toISOString().split('T')[0];
      valid = valid && (rideDate === filterDate);
    }
    
    if (filterMinPrice) {
      valid = valid && ride.pricePerSeat >= parseFloat(filterMinPrice);
    }
    
    if (filterMaxPrice) {
      valid = valid && ride.pricePerSeat <= parseFloat(filterMaxPrice);
    }

    return valid;
  });

  // New modal submit handler
  const handleSeatSubmit = async (seatsRequested) => {
    // Validation 3: Check seat availability
    if (seatsRequested > selectedRide.availableSeats) {
      alert('Requested seats exceed available seats');
      return;
    }

    try {
      // Existing API call logic
      const response = await fetch('http://localhost:5000/api/rides/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rideId: selectedRide._id,
          seatsRequested: seatsRequested
        })
      });
      const data = await response.json();
      if (data.success) {
        console.log('Ride request submitted successfully!');
        // alert('Ride request submitted successfully!');
      } else {
        alert('Failed to submit ride request.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while requesting the ride.');
    } finally {
      setShowSeatModal(false);
    }
  };

  if (loading) {
    return <Container>Loading rides...</Container>;
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Find Rides</h1>
        <FilterButton 
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFilter /> Filters
        </FilterButton>
      </div>

      {/* NEW: Filter Menu */}
      {showFilterMenu && (
        <FilterMenu>
          <div>
            <FilterLabel>Seats:</FilterLabel>
            <FilterInput
              type="number"
              placeholder="Min Seats"
              value={filterSeats}
              onChange={e => setFilterSeats(e.target.value)}
              min="1"
            />
          </div>
          <div>
            <FilterLabel>Gender Preference:</FilterLabel>
            <FilterSelect
              value={filterGender}
              onChange={e => setFilterGender(e.target.value)}
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
              value={filterMaxPrice}
              onChange={e => setFilterMaxPrice(e.target.value)}
            />
          </div>
          <FilterButton onClick={() => {
            setFilterSeats('');
            setFilterGender('No Preference');
            setFilterDate('');
            setFilterMinPrice('');
            setFilterMaxPrice('');
          }}>
            Clear Filters
          </FilterButton>
        </FilterMenu>
      )}

      <LayoutContainer $hasSelection={!!selectedRideDetails}>
        <RideGrid>
          <AnimatePresence>
            {filteredRides.map(ride => {
              // Map the route coordinates to start and end points.
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={() => setSelectedRideDetails(ride)}
                >
                  <CardHeader>
                    <DriverInfo>
                      <Avatar 
                        $bg={ride.driver?.profilePicture ? 'transparent' : '#2d2d2d'}
                        $fallback={ride.driver?.name?.charAt(0)}
                      >
                        {ride.driver?.profilePicture && (
                          <img 
                            src={ride.driver.profilePicture}
                            alt={ride.driver.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.style.background = '#2d2d2d';
                            }}
                          />
                        )}
                      </Avatar>
                      <div>
                        <h3>{ride.driver?.name}'s Ride</h3>
                        <p className="text-sm text-gray-400">{ride.vehicleType} • {ride.vehicleModel}</p>
                      </div>
                    </DriverInfo>
                    <Badge variant="seats">{ride.availableSeats} seats left</Badge>
                  </CardHeader>
                  
                  {ride.preferredGender !== 'No Preference' && (
                    <Badge style={{ marginBottom: '1rem' }}>
                      {ride.preferredGender} Only
                    </Badge>
                  )}
                  
                  <DetailGrid>
                    <DetailItem>
                      <FaCalendarAlt />
                      <div>
                        <div className="text-xs text-gray-400">Date</div>
                        {format(new Date(ride.schedule[0].departureTime), 'dd MMM yyyy')}
                      </div>
                    </DetailItem>
                    
                    <DetailItem>
                      <FaClock />
                      <div>
                        <div className="text-xs text-gray-400">Time</div>
                        {format(new Date(ride.schedule[0].departureTime), 'hh:mm a')}
                      </div>
                    </DetailItem>
                    
                    <DetailItem>
                      <FaDollarSign />
                      <div>
                        <div className="text-xs text-gray-400">Price</div>
                        PKR {ride.pricePerSeat}/seat
                      </div>
                    </DetailItem>
                    
                    <DetailItem>
                      <FaUsers />
                      <div>
                        <div className="text-xs text-gray-400">Vehicle</div>
                        {ride.vehicleType}
                      </div>
                    </DetailItem>
                  </DetailGrid>
                  
                  <div style={{ margin: '1rem 0' }}>
                    <RouteMap
                      startPoint={startPoint}
                      endPoint={endPoint}
                      readOnly
                      height="120px"
                    />
                  </div>

                  <LocationDetails>
                    <LocationDisplay 
                      lat={startPoint.lat} 
                      lng={startPoint.lng} 
                      type="from" 
                    />
                    <LocationDisplay 
                      lat={endPoint.lat} 
                      lng={endPoint.lng} 
                      type="to" 
                    />
                  </LocationDetails>

                  <RequestButton onClick={() => handleRequest(ride)}>
                    Request Ride
                  </RequestButton>
                </RideCard>
              );
            })}
          </AnimatePresence>
        </RideGrid>
        
        <AnimatePresence>
          {selectedRideDetails && (
            <RideDetailsPanel
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <PanelHeader>
                <BackButton 
                  onClick={() => setSelectedRideDetails(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft /> Back to List
                </BackButton>
                <h2>{selectedRideDetails.driver?.name}'s Ride Details</h2>
              </PanelHeader>

              <DetailSection>
                <MapContainer>
                  <RouteMap
                    startPoint={{
                      lat: selectedRideDetails.route.coordinates[0][1],
                      lng: selectedRideDetails.route.coordinates[0][0]
                    }}
                    endPoint={{
                      lat: selectedRideDetails.route.coordinates[1][1],
                      lng: selectedRideDetails.route.coordinates[1][0]
                    }}
                    readOnly
                    height="250px"
                  />
                </MapContainer>

                <InfoGrid>
                  <InfoItem>
                    <FaCalendarAlt />
                    <div>
                      <Label>Departure Date</Label>
                      <Value>
                        {format(new Date(selectedRideDetails.schedule[0].departureTime), 'PPP')}
                      </Value>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <FaClock />
                    <div>
                      <Label>Departure Time</Label>
                      <Value>
                        {format(new Date(selectedRideDetails.schedule[0].departureTime), 'p')}
                      </Value>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <FaUsers />
                    <div>
                      <Label>Seats Available</Label>
                      <Value>{selectedRideDetails.availableSeats}</Value>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <FaDollarSign />
                    <div>
                      <Label>Price per Seat</Label>
                      <Value>PKR {selectedRideDetails.pricePerSeat}</Value>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <FaCar />
                    <div>
                      <Label>Vehicle</Label>
                      <Value>{selectedRideDetails.vehicleType} ({selectedRideDetails.vehicleModel})</Value>
                    </div>
                  </InfoItem>
                </InfoGrid>

                <RouteDetails>
                  <h3>Route Information</h3>
                  <Coordinate>
                    <FaMapMarkerAlt className="text-green-400" />
                    <LocationDisplay 
                      lat={selectedRideDetails.route.coordinates[0][1]} 
                      lng={selectedRideDetails.route.coordinates[0][0]} 
                      type="from" 
                    />
                  </Coordinate>
                  <Coordinate>
                    <FaMapMarkerAlt className="text-red-400" />
                    <LocationDisplay 
                      lat={selectedRideDetails.route.coordinates[1][1]} 
                      lng={selectedRideDetails.route.coordinates[1][0]} 
                      type="to" 
                    />
                  </Coordinate>
                </RouteDetails>

                <ActionContainer>
                  <RequestButton 
                    onClick={() => handleRequest(selectedRideDetails)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Request Ride
                  </RequestButton>
                </ActionContainer>
              </DetailSection>
            </RideDetailsPanel>
          )}
        </AnimatePresence>
      </LayoutContainer>
      {showSeatModal && (
        <SeatRequestModal
          ride={selectedRide}
          onClose={() => setShowSeatModal(false)}
          onSubmit={handleSeatSubmit}
        />
      )}
    </Container>
  );
};

export default FindRides; 