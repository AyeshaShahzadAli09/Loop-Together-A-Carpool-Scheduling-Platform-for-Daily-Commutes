import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaIdCard, FaCar, FaFileUpload, FaTimes, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const FormOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormContainer = styled(motion.div)`
  width: 90%;
  max-width: 600px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 1001;

  &:hover {
    transform: scale(1.1);
  }
`;

const ImagePreviewContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.5rem;
    color: white;
    font-size: 0.8rem;
  }
`;

const SuccessModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 255, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  color: white;
  z-index: 1100;

  svg {
    font-size: 3rem;
    color: #4CAF50;
    margin-bottom: 1rem;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-top: 0.5rem;
  font-size: 0.9rem;
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

  const [previews, setPreviews] = useState({
    licenseImage: null,
    vehicleImage: null
  });

  const [uploadProgress, setUploadProgress] = useState({
    licenseImage: 0,
    vehicleImage: 0
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match(/image\/(jpeg|jpg|png)/i)) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: 'Please upload a valid image file (JPG, JPEG, PNG)'
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({
        ...prev,
        [fieldName]: 'File size should be less than 5MB'
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({
        ...prev,
        [fieldName]: reader.result
      }));
    };
    reader.readAsDataURL(file);

    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const newErrors = {};
    if (!formData.driverLicense) newErrors.driverLicense = 'Driver License number is required';
    if (!formData.vehiclePlate) newErrors.vehiclePlate = 'Vehicle Plate number is required';
    if (!formData.licenseImage) newErrors.licenseImage = 'License Image is required';
    if (!formData.vehicleImage) newErrors.vehicleImage = 'Vehicle Image is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('driverLicense', formData.driverLicense);
      formDataToSend.append('vehiclePlate', formData.vehiclePlate);
      formDataToSend.append('licenseImage', formData.licenseImage);
      formDataToSend.append('vehicleImage', formData.vehicleImage);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/driver/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit verification');
      }

      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
        // Update user state
        dispatch({ 
          type: 'UPDATE_USER', 
          payload: { ...user, isDriver: true, isVerified: false }
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Verification submission error:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FormContainer>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title>Driver Verification</Title>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Driver License Number</Label>
            <Input
              type="text"
              name="driverLicense"
              value={formData.driverLicense}
              onChange={handleInputChange}
              placeholder="Enter your driver license number"
            />
            {errors.driverLicense && <ErrorMessage>{errors.driverLicense}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Vehicle Plate Number</Label>
            <Input
              type="text"
              name="vehiclePlate"
              value={formData.vehiclePlate}
              onChange={handleInputChange}
              placeholder="Enter your vehicle plate number"
            />
            {errors.vehiclePlate && <ErrorMessage>{errors.vehiclePlate}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>License Image</Label>
            <FileUploadLabel>
              <FaIdCard />
              <span>Upload License Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'licenseImage')}
                style={{ display: 'none' }}
              />
            </FileUploadLabel>
            {errors.licenseImage && <ErrorMessage>{errors.licenseImage}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Vehicle Image</Label>
            <FileUploadLabel>
              <FaCar />
              <span>Upload Vehicle Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'vehicleImage')}
                style={{ display: 'none' }}
              />
            </FileUploadLabel>
            {errors.vehicleImage && <ErrorMessage>{errors.vehicleImage}</ErrorMessage>}
          </FormGroup>

          <ImagePreviewContainer>
            {previews.licenseImage && (
              <ImagePreview>
                <img src={previews.licenseImage} alt="License Preview" />
                <div className="overlay">
                  License Image
                  {uploadProgress.licenseImage > 0 && 
                    <div>Uploading: {uploadProgress.licenseImage}%</div>
                  }
                </div>
              </ImagePreview>
            )}
            {previews.vehicleImage && (
              <ImagePreview>
                <img src={previews.vehicleImage} alt="Vehicle Preview" />
                <div className="overlay">
                  Vehicle Image
                  {uploadProgress.vehicleImage > 0 && 
                    <div>Uploading: {uploadProgress.vehicleImage}%</div>
                  }
                </div>
              </ImagePreview>
            )}
          </ImagePreviewContainer>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

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

      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <FaCheck />
            <h3>Verification Request Submitted!</h3>
            <p>We'll review your application and get back to you soon.</p>
          </SuccessModal>
        )}
      </AnimatePresence>
    </FormOverlay>
  );
};

export default DriverVerificationForm; 