import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRoute, FaCalendarAlt, FaComments, FaHistory, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { MdDashboard, MdNotifications } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileSection from '../../components/profile/ProfileSection';

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

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
        </NavItem>
        <NavItem
          active={activeTab === 'schedule'}
          onClick={() => setActiveTab('schedule')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCalendarAlt /> Schedule Rides
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
          <MdNotifications /> Notifications
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
        {activeTab === 'profile' ? (
          <ProfileSection />
        ) : (
          <>
            <WelcomeCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Welcome back, User!</h1>
              <p>Find your perfect carpool match today</p>
            </WelcomeCard>

            <ActionGrid>
              <ActionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3>Quick Find Ride</h3>
                <p>Search for available carpools matching your route</p>
              </ActionCard>
              <ActionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3>Scheduled Rides</h3>
                <p>View and manage your upcoming rides</p>
              </ActionCard>
              <ActionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3>Messages</h3>
                <p>Chat with your carpool matches</p>
              </ActionCard>
            </ActionGrid>
          </>
        )}
      </MainContent>
    </DashboardGrid>
  );
};

export default UserDashboard; 