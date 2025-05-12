import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCarAlt, FaCalendarAlt, FaComments, FaHistory, FaUsers, FaUser, FaStar } from 'react-icons/fa';
import { MdDashboard, MdNotifications } from 'react-icons/md';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileSection from '../../components/profile/ProfileSection';
import CreateCarpoolRoute from '../../components/driver/CreateCarpoolRoute';
import ScheduledRides from '../../components/driver/ScheduledRides';
import RideDetailPanel from '../../components/driver/RideDetailPanel';
import Passengers from '../../components/driver/Passengers';
import Messages from '../../components/shared/Messages';
import NotificationsPanel from '../../components/dashboard/NotificationsPanel';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import RatingsPanel from '../../components/driver/RatingsPanel';
import ActiveRidesPanel from '../../components/driver/ActiveRidesPanel';
import RideHistory from '../../components/driver/RideHistory';
import axios from 'axios';
import { apiRequest } from '../../config';
import { ErrorBoundary } from 'react-error-boundary';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const MainContent = styled.div`
  padding: 2rem;
`;

const NavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 12px;
  cursor: pointer;
  color: ${props => props.active ? '#ff00ff' : '#fff'};
  background: ${props => props.active ? 'rgba(255, 0, 255, 0.1)' : 'transparent'};
  box-shadow: ${props => props.active ? '0 0 15px rgba(255, 0, 255, 0.3)' : 'none'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    margin-right: 1rem;
    font-size: 1.2rem;
  }
`;

const WelcomeCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.2);

  h1 {
    margin: 0;
    font-size: 2rem;
    background: linear-gradient(45deg, #ff00ff, #ff8800);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ActionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
  }

  &:hover {
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 0;
    font-size: 2rem;
    color: #ff00ff;
  }

  p {
    margin: 0.5rem 0 0;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Badge = styled.span`
  background-color: #ff00ff;
  color: white;
  border-radius: 50%;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  margin-left: 0.5rem;
`;

const DriverDashboard = ({ initialTab = null }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');
  const [selectedRide, setSelectedRide] = useState(null);
  const navigate = useNavigate();
  const { dispatch, user } = useAuth();
  const { unreadCount } = useNotifications();
  const [activeRideCount, setActiveRideCount] = useState(0);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [todayRides, setTodayRides] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const fetchActiveRideCount = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('rides/active'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setActiveRideCount(response.data.data.length);
    } catch (error) {
      console.error('Error fetching active ride count:', error);
    }
  };

  const fetchTotalPassengers = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('rides/passengers/total'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTotalPassengers(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching total passengers:', error);
      setTotalPassengers(0);
    }
  };

  const fetchDriverRating = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('driver/ratings'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDriverRating(response.data.averageRating || 0);
    } catch (error) {
      console.error('Error fetching driver rating:', error);
      setDriverRating(0);
    }
  };

  const fetchTodayRides = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(apiRequest(`rides/date/${today}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTodayRides(response.data.data || []);
    } catch (error) {
      console.error('Error fetching today rides:', error);
      setTodayRides([]);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('rides/requests/pending'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPendingRequests(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setPendingRequests(0);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchActiveRideCount(),
        fetchTotalPassengers(),
        fetchDriverRating(),
        fetchTodayRides(),
        fetchPendingRequests()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardGrid>
      <Sidebar>
        <NavItem
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <MdDashboard /> Dashboard
        </NavItem>
        <NavItem
          active={activeTab === 'createRide'}
          onClick={() => setActiveTab('createRide')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCarAlt /> Create Ride
        </NavItem>
        <NavItem
          active={activeTab === 'schedule'}
          onClick={() => {
            setActiveTab('schedule');
            setSelectedRide(null);
          }}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCalendarAlt /> My Schedule
        </NavItem>
        <NavItem
          active={activeTab === 'activeRides'}
          onClick={() => setActiveTab('activeRides')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCarAlt size={20} />
          Active Rides
          {activeRideCount > 0 && (
            <Badge>{activeRideCount}</Badge>
          )}
        </NavItem>
        <NavItem
          active={activeTab === 'passengers'}
          onClick={() => setActiveTab('passengers')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUsers /> Passengers
          {pendingRequests > 0 && (
            <Badge>{pendingRequests}</Badge>
          )}
        </NavItem>
        <NavItem
          active={activeTab === 'messages'}
          onClick={() => setActiveTab('messages')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaComments /> Messages
        </NavItem>
        <NavItem
          active={activeTab === 'ratings'}
          onClick={() => setActiveTab('ratings')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaStar /> My Ratings
        </NavItem>
        <NavItem
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaHistory /> Ride History
        </NavItem>
        <NavItem
          active={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell /> Notifications
          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
        </NavItem>
        <NavItem
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUser /> My Profile
        </NavItem>
        <NavItem
          onClick={handleLogout}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="mt-auto"
          style={{ color: '#ef4444' }}
        >
          <FaSignOutAlt /> Logout
        </NavItem>
      </Sidebar>

      <MainContent>
        {activeTab === 'messages' ? (
          <Messages isDriverMode={true} />
        ) : activeTab === 'profile' ? (
          <ProfileSection />
        ) : activeTab === 'createRide' ? (
          <CreateCarpoolRoute />
        ) : activeTab === 'schedule' ? (
          <div style={{ display: 'flex', gap: '1rem', transition: 'all 0.3s ease' }}>
            <div style={{ flex: selectedRide ? '0 0 50%' : '1' }}>
              <ScheduledRides onRideSelect={setSelectedRide} />
            </div>
            {selectedRide && (
              <div style={{ flex: '0 0 50%' }}>
                <RideDetailPanel ride={selectedRide} onClose={() => setSelectedRide(null)} />
              </div>
            )}
          </div>
        ) : activeTab === 'history' ? (
          <RideHistory />
        ) : activeTab === 'passengers' ? (
          <Passengers />
        ) : activeTab === 'notifications' ? (
          <NotificationsPanel />
        ) : activeTab === 'activeRides' ? (
          <ErrorBoundary
            fallback={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Something went wrong loading active rides</h2>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    background: 'rgba(74, 222, 128, 0.2)',
                    color: '#4ade80',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    marginTop: '1rem'
                  }}
                >
                  Refresh Page
                </button>
              </div>
            }
          >
            <ActiveRidesPanel />
          </ErrorBoundary>
        ) : activeTab === 'ratings' ? (
          <RatingsPanel />
        ) : (
          <>
            <WelcomeCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Welcome to Driver Mode{user?.name ? `, ${user.name}` : ''}!</h1>
              <p>Manage your rides and connect with passengers</p>
            </WelcomeCard>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Loading dashboard data...</p>
              </div>
            ) : (
              <>
                <StatsGrid>
                  <StatCard
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('activeRides')}
                  >
                    <h3>{activeRideCount}</h3>
                    <p>Active Rides</p>
                  </StatCard>
                  <StatCard
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('passengers')}
                  >
                    <h3>{totalPassengers}</h3>
                    <p>Total Passengers</p>
                  </StatCard>
                  <StatCard
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('ratings')}
                  >
                    <h3>{driverRating.toFixed(1)}</h3>
                    <p>Rating</p>
                  </StatCard>
                </StatsGrid>

                <ActionGrid>
                  <ActionCard
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('createRide')}
                  >
                    <h3>Create New Ride</h3>
                    <p>Set up a new carpool route and schedule</p>
                  </ActionCard>
                  <ActionCard
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('passengers')}
                  >
                    <h3>Passenger Requests {pendingRequests > 0 && `(${pendingRequests})`}</h3>
                    <p>View and manage ride requests</p>
                  </ActionCard>
                  <ActionCard
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('schedule')}
                  >
                    <h3>Today's Schedule {todayRides.length > 0 && `(${todayRides.length})`}</h3>
                    <p>View your upcoming rides for today</p>
                  </ActionCard>
                  <ActionCard
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('history')}
                  >
                    <h3>Ride History</h3>
                    <p>View your completed rides and passenger ratings</p>
                  </ActionCard>
                </ActionGrid>
              </>
            )}
          </>
        )}
      </MainContent>
    </DashboardGrid>
  );
};

export default DriverDashboard; 