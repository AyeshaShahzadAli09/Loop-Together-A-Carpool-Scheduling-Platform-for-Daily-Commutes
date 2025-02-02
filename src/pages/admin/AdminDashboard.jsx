import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import VerificationList from '../../components/admin/VerificationList';
import VerificationDetails from '../../components/admin/VerificationDetails';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserShield } from 'react-icons/fa';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const discoBallEffect = keyframes`
  0% {
    opacity: 0.3;
    transform: translateY(-50%) rotate(0deg);
  }
  50% {
    opacity: 0.6;
    transform: translateY(-50%) rotate(180deg);
  }
  100% {
    opacity: 0.3;
    transform: translateY(-50%) rotate(360deg);
  }
`;

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    -45deg,
    #1a1a2e,
    #16213e,
    #1a1a4f,
    #162156
  );
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  color: #fff;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    animation: ${discoBallEffect} 20s linear infinite;
    pointer-events: none;
  }
`;

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AdminIcon = styled(FaUserShield)`
  font-size: 2rem;
  color: #4ade80;
`;

const Title = styled.h1`
  font-size: 2rem;
  background: linear-gradient(45deg, #4ade80, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
`;

const LogoutButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  background: linear-gradient(45deg, #ff4444, #ff1111);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(255, 68, 68, 0.3);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(255, 68, 68, 0.5);
  }
`;

const ContentContainer = styled(motion.div)`
  position: relative;
  z-index: 1;
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
      <Header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TitleContainer>
          <AdminIcon />
          <Title>Admin Dashboard</Title>
        </TitleContainer>
        <LogoutButton
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSignOutAlt /> Logout
        </LogoutButton>
      </Header>
      
      <ContentContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
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
      </ContentContainer>
    </DashboardContainer>
  );
};

export default AdminDashboard; 