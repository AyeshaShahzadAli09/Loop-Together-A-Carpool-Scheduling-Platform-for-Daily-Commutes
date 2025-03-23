import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import UserDashboard from './UserDashboard';
import DriverDashboard from './DriverDashboard';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBell from '../../components/common/NotificationBell';
import DriverVerificationForm from '../../components/driver/DriverVerificationForm';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f4c46 0%, #0e3b36 100%);
  color: #fff;
  position: relative;
  padding-top: 80px;
`;

const RoleSwitcherContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(15, 76, 70, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  transform: rotate(12deg);
`;

const LogoText = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  color: #4ade80;
  font-family: 'Dancing Script', cursive;
`;

const TaglineContainer = styled(motion.div)`
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-style: italic;
  letter-spacing: 0.5px;
`;

const HeaderActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const RoleSwitcher = styled(motion.button)`
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  background: rgba(250, 250, 250, 0.15);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2),
            0 0 30px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.7),
                0 0 40px rgba(0, 255, 255, 0.4);
  }
`;

const DashboardContent = styled(motion.div)`
  width: 100%;
  min-height: calc(100vh - 80px);
`;

// Taglines for different modes
const userTaglines = [
  "Find your perfect ride companion today",
  "Sustainable travel, one shared ride at a time",
  "Connect with drivers heading your way",
  "Save money, reduce emissions, make friends",
  "Your eco-friendly commute starts here",
  "Share the ride, share the responsibility"
];

const driverTaglines = [
  "Turn your daily commute into an opportunity",
  "Be the driver that makes a difference",
  "Share your journey, earn rewards",
  "Create rides, connect communities",
  "Your car, your schedule, our platform",
  "Drive change in sustainable commuting"
];

// Add custom toast styles
const Toast = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 2rem;
  background: rgba(15, 76, 70, 0.9);
  color: white;
  border-radius: 8px;
  z-index: 1100;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Dashboard = ({ initialTab = null }) => {
  const { user } = useAuth();
  const { switchMode } = useNotifications();
  const [isDriverMode, setIsDriverMode] = useState(false);
  const [currentTagline, setCurrentTagline] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [toast, setToast] = useState(null);

  const getRandomTagline = (taglines) => {
    const randomIndex = Math.floor(Math.random() * taglines.length);
    return taglines[randomIndex];
  };

  // Custom toast function
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    // Update tagline when mode changes
    setCurrentTagline(getRandomTagline(isDriverMode ? driverTaglines : userTaglines));
    // Update notification context with current mode
    switchMode(isDriverMode ? 'driver' : 'rider');
  }, [isDriverMode, switchMode]);

  const handleModeSwitch = () => {
    if (!user.isDriver) {
      setShowVerificationForm(true);
      return;
    }
    
    if (user.isDriver && !user.isVerified) {
      // Show pending verification message using our custom toast
      showToast("Your driver verification request is being reviewed. Please check back later.");
      return;
    }

    setIsDriverMode(prev => !prev);
  };

  return (
    <DashboardContainer>
      <RoleSwitcherContainer>
        <LogoContainer>
          <LogoImage src="/Logo.png" alt="Loop Together" />
          <LogoText>Loop Together</LogoText>
        </LogoContainer>

        <TaglineContainer
          key={currentTagline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {currentTagline}
        </TaglineContainer>

        <HeaderActionsContainer>
          <NotificationBell />
          
          <RoleSwitcher
            onClick={handleModeSwitch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Switch to {isDriverMode ? 'User' : 'Driver'} Mode
          </RoleSwitcher>
        </HeaderActionsContainer>
      </RoleSwitcherContainer>
      
      <DashboardContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {isDriverMode ? (
          <DriverDashboard initialTab={initialTab} />
        ) : (
          <UserDashboard initialTab={initialTab} />
        )}
      </DashboardContent>

      <AnimatePresence>
        {showVerificationForm && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DriverVerificationForm onClose={() => setShowVerificationForm(false)} />
          </Modal>
        )}
      </AnimatePresence>

      {/* Add Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {toast}
          </Toast>
        )}
      </AnimatePresence>
    </DashboardContainer>
  );
};

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export default Dashboard; 