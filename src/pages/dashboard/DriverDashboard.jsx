import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCarAlt, FaCalendarAlt, FaComments, FaHistory, FaUsers, FaUser } from 'react-icons/fa';
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

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRide, setSelectedRide] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    dispatch({ type: 'LOGOUT' });
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
          active={activeTab === 'passengers'}
          onClick={() => setActiveTab('passengers')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUsers /> Passengers
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
          <>
            <WelcomeCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Welcome to Driver Mode!</h1>
              <p>Manage your rides and connect with passengers</p>
            </WelcomeCard>

            <StatsGrid>
              <StatCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3>12</h3>
                <p>Active Rides</p>
              </StatCard>
              <StatCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3>48</h3>
                <p>Total Passengers</p>
              </StatCard>
              <StatCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3>4.8</h3>
                <p>Rating</p>
              </StatCard>
            </StatsGrid>

            <ActionGrid>
              <ActionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3>Create New Ride</h3>
                <p>Set up a new carpool route and schedule</p>
              </ActionCard>
              <ActionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3>Passenger Requests</h3>
                <p>View and manage ride requests</p>
              </ActionCard>
              <ActionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('schedule')}
              >
                <h3>Today's Schedule</h3>
                <p>View your upcoming rides for today</p>
              </ActionCard>
            </ActionGrid>
          </>
        ) : activeTab === 'passengers' ? (
          <Passengers />
        ) : (
          <>
            <WelcomeCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Welcome to Driver Mode!</h1>
              <p>Manage your rides and connect with passengers</p>
            </WelcomeCard>

            <StatsGrid>
              <StatCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3>12</h3>
                <p>Active Rides</p>
              </StatCard>
              <StatCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3>48</h3>
                <p>Total Passengers</p>
              </StatCard>
              <StatCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3>4.8</h3>
                <p>Rating</p>
              </StatCard>
            </StatsGrid>

            <ActionGrid>
              <ActionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3>Create New Ride</h3>
                <p>Set up a new carpool route and schedule</p>
              </ActionCard>
              <ActionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3>Passenger Requests</h3>
                <p>View and manage ride requests</p>
              </ActionCard>
              <ActionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('schedule')}
              >
                <h3>Today's Schedule</h3>
                <p>View your upcoming rides for today</p>
              </ActionCard>
            </ActionGrid>
          </>
        )}
      </MainContent>
    </DashboardGrid>
  );
};

export default DriverDashboard; 