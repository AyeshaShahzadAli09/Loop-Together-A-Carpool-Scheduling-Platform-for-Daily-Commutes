import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaIdCard, FaCar, FaFileUpload } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const FormContainer = styled(motion.div)`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  text-align: center;
  color: #fff;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #fff;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
  }
`;

const FileUploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(45deg, #00ffff, #00ccff);
  color: #000;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const DriverVerificationForm = ({ onClose }) => {
  const { user, dispatch } = useAuth();
  const [formData, setFormData] = useState({
    driverLicense: '',
    vehiclePlate: '',
    licenseImage: null,
    vehicleImage: null
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('driverLicense', formData.driverLicense);
      formDataToSend.append('vehiclePlate', formData.vehiclePlate);
      formDataToSend.append('licenseImage', formData.licenseImage);
      formDataToSend.append('vehicleImage', formData.vehicleImage);

      // Make API call to submit driver verification request
      const response = await fetch('/api/driver/verify', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        dispatch({ 
          type: 'UPDATE_USER', 
          payload: { ...user, isDriver: true, isVerified: false }
        });
        onClose();
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Title>Driver Verification Request</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Driver's License Number</Label>
          <Input
            type="text"
            value={formData.driverLicense}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              driverLicense: e.target.value
            }))}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Vehicle Plate Number</Label>
          <Input
            type="text"
            value={formData.vehiclePlate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              vehiclePlate: e.target.value
            }))}
            required
          />
        </FormGroup>

        <FormGroup>
          <FileUploadLabel>
            <FaIdCard />
            <span>Upload License Image</span>
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, 'licenseImage')}
              accept="image/*"
              required
            />
          </FileUploadLabel>
        </FormGroup>

        <FormGroup>
          <FileUploadLabel>
            <FaCar />
            <span>Upload Vehicle Image</span>
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, 'vehicleImage')}
              accept="image/*"
              required
            />
          </FileUploadLabel>
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Submitting...' : 'Submit Verification Request'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default DriverVerificationForm; 