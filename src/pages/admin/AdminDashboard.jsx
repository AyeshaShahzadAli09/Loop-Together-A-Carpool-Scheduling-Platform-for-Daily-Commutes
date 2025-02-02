import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import VerificationList from '../../components/admin/VerificationList';
import VerificationDetails from '../../components/admin/VerificationDetails';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #4ade80;
`;

const LogoutButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: #ff4444;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const AdminDashboard = () => {
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleStatusUpdate = () => {
    setSelectedVerification(null);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </LogoutButton>
      </Header>
      
      <VerificationList
        onSelect={setSelectedVerification}
        selectedId={selectedVerification?._id}
        key={refreshTrigger}
      />
      
      {selectedVerification && (
        <VerificationDetails
          verification={selectedVerification}
          onClose={() => setSelectedVerification(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard; 