import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRoute, FaCalendarAlt, FaComments, FaHistory, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { MdDashboard, MdNotifications } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ProfileSection from '../../components/profile/ProfileSection';
import FindRidesSection from '../../components/rider/FindRides';
import ScheduledRides from '../../components/rider/ScheduledRides';
import Messages from '../../components/shared/Messages';
import NotificationsPanel from '../../components/dashboard/NotificationsPanel';
import axios from 'axios';
import { apiRequest } from '../../config';

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
  color: ${props => props.active ? '#00ffff' : '#fff'};
  background: ${props => props.active ? 'rgba(0, 255, 255, 0.1)' : 'transparent'};
  box-shadow: ${props => props.active ? '0 0 15px rgba(0, 255, 255, 0.3)' : 'none'};

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
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);

  h1 {
    margin: 0;
    font-size: 2rem;
    background: linear-gradient(45deg, #00ffff, #ff00ff);
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
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const UserDashboard = ({ initialTab = null }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { unreadCount } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [availableMatches, setAvailableMatches] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchUpcomingRides = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('rides/user/upcoming'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUpcomingRides(response.data.data || []);
    } catch (error) {
      console.error('Error fetching upcoming rides:', error);
      setUpcomingRides([]);
    }
  };

  const fetchAvailableMatches = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('rides/available'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAvailableMatches(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching available matches:', error);
      setAvailableMatches(0);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(apiRequest('messages/unread'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUnreadMessages(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      setUnreadMessages(0);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchUpcomingRides(),
        fetchAvailableMatches(),
        fetchUnreadMessages()
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
          active={activeTab === 'findRides'}
          onClick={() => setActiveTab('findRides')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRoute /> Find Rides
          {availableMatches > 0 && (
            <div style={{
              position: 'absolute',
              right: '10px',
              backgroundColor: '#4ade80',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {availableMatches > 99 ? '99+' : availableMatches}
            </div>
          )}
        </NavItem>
        <NavItem
          active={activeTab === 'schedule'}
          onClick={() => setActiveTab('schedule')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCalendarAlt /> Schedule Rides
          {upcomingRides.length > 0 && (
            <div style={{
              position: 'absolute',
              right: '10px',
              backgroundColor: '#4ade80',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {upcomingRides.length}
            </div>
          )}
        </NavItem>
        <NavItem
          active={activeTab === 'messages'}
          onClick={() => setActiveTab('messages')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaComments /> Messages
          {unreadMessages > 0 && (
            <div style={{
              position: 'absolute',
              right: '10px',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadMessages > 99 ? '99+' : unreadMessages}
            </div>
          )}
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
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MdNotifications /> 
            <span style={{ marginLeft: '8px' }}>Notifications</span>
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute',
                right: '-20px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </div>
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
          <Messages isDriverMode={false} />
        ) : activeTab === 'profile' ? (
          <ProfileSection />
        ) : activeTab === 'findRides' ? (
          <FindRidesSection />
        ) : activeTab === 'schedule' ? (
          <ScheduledRides />
        ) : activeTab === 'notifications' ? (
          <NotificationsPanel />
        ) : (
          <>
            <WelcomeCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Welcome back{user?.name ? `, ${user.name}` : ''}!</h1>
              <p>Find your perfect carpool match today</p>
            </WelcomeCard>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Loading dashboard data...</p>
              </div>
            ) : (
              <ActionGrid>
                <ActionCard
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('findRides')}
                >
                  <h3>Find Rides {availableMatches > 0 && `(${availableMatches} available)`}</h3>
                  <p>Search for available carpools matching your route</p>
                </ActionCard>
                <ActionCard
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('schedule')}
                >
                  <h3>Scheduled Rides {upcomingRides.length > 0 && `(${upcomingRides.length} upcoming)`}</h3>
                  <p>View and manage your upcoming rides</p>
                </ActionCard>
                <ActionCard
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('messages')}
                >
                  <h3>Messages {unreadMessages > 0 && `(${unreadMessages} unread)`}</h3>
                  <p>Chat with your carpool matches</p>
                </ActionCard>
              </ActionGrid>
            )}
          </>
        )}
      </MainContent>
    </DashboardGrid>
  );
};

export default UserDashboard; 