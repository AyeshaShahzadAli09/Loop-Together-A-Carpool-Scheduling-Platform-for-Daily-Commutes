import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
  padding: 2rem;
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  border: 1px solid rgba(74, 222, 128, 0.2);
`;

const SeatInput = styled.input`
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #4ade80;
  border-radius: 8px;
  color: white;
  font-size: 1.2rem;
  text-align: center;
`;

const SeatRequestModal = ({ ride, onClose, onSubmit }) => {
  const [seats, setSeats] = useState(1);

  return (
    <ModalBackdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Request Seats for {ride.driver?.name}'s Ride</h3>
        <p>Available seats: {ride.availableSeats}</p>
        
        <SeatInput
          type="number"
          min="1"
          max={ride.availableSeats}
          value={seats}
          onChange={(e) => setSeats(Math.min(e.target.value, ride.availableSeats))}
        />
        
        <button 
          onClick={() => onSubmit(seats)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-all"
        >
          Confirm Request
        </button>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default SeatRequestModal; 