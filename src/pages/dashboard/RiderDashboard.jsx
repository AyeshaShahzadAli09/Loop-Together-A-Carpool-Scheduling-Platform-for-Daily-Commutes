import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';

const RiderDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <DashboardGrid>
      <Sidebar>
        <NavItem
          active={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell /> Notifications
          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
        </NavItem>
        <NavItem onClick={handleLogout} whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
          <FaSignOutAlt /> Logout
        </NavItem>
      </Sidebar>

      <MainContent>
        {activeTab === 'notifications' && (
          <NotificationsPanel />
        )}
      </MainContent>
    </DashboardGrid>
  );
};

const Badge = styled.span`
  background-color: #ff00ff;
  color: white;
  border-radius: 50%;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  margin-left: 0.5rem;
`;

export default RiderDashboard; 