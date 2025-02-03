import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendar, FaUsers, FaDollarSign } from 'react-icons/fa';
import { validateFormData } from '../../utils/helper';
import RouteMap from '../maps/RouteMap';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  max-width: 800px;
  margin: 0 auto;
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
  }

  /* Styling the options */
  option {
    background: rgb(30, 30, 30);
    color: white;
    padding: 10px;
    font-size: 1rem;
    
    &:hover, &:focus {
      background: rgb(45, 45, 45);
    }
  }
`;

const MapContainer = styled.div`
  height: 300px;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #00ffff 0%, #4ade80 100%);
  border: none;
  border-radius: 8px;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SelectWrapper = styled.div`
  position: relative;

  &::after {
    content: '▼';
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    pointer-events: none;
    font-size: 0.8rem;
  }
`;

const SuccessMessage = styled.div`
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.2);
  color: #4ade80;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const CreateCarpoolRoute = () => {
  const [formData, setFormData] = useState({
    startPoint: '',
    endPoint: '',
    departureTime: '',
    recurrence: 'Single', // Single, Daily, Weekly
    preferredGender: 'No Preference',
    availableSeats: '',
    pricePerSeat: '',
    vehicleType: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Add new state for map points
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  const navigate = useNavigate();

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

  const resetForm = () => {
    setFormData({
      departureTime: '',
      recurrence: 'Single',
      preferredGender: 'No Preference',
      availableSeats: '',
      pricePerSeat: '',
      vehicleType: ''
    });
    setStartPoint(null);
    setEndPoint(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setSuccess('');

    try {
      if (!startPoint || !endPoint) {
        setErrors(prev => ({
          ...prev,
          route: 'Please select both start and end points on the map'
        }));
        return;
      }

      const carpoolData = {
        route: {
          type: 'LineString',
          coordinates: [
            [startPoint.lng, startPoint.lat],
            [endPoint.lng, endPoint.lat]
          ]
        },
        schedule: [{
          departureTime: formData.departureTime,
          recurrence: formData.recurrence
        }],
        pricePerSeat: parseFloat(formData.pricePerSeat),
        availableSeats: parseInt(formData.availableSeats),
        vehicleType: formData.vehicleType,
        preferredGender: formData.preferredGender,
        recurrence: formData.recurrence
      };

      const response = await fetch('http://localhost:5000/api/carpool/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(carpoolData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccess('Carpool route created successfully! You can create another route or view your routes in the dashboard.');
      resetForm();

    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: `Route creation error: ${error.message}`
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6">Create Carpool Route</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label>Select Route Points</Label>
          <p className="text-sm text-gray-300 mb-2">
            Click on the map to set start and end points
          </p>
          <RouteMap
            startPoint={startPoint}
            setStartPoint={setStartPoint}
            endPoint={endPoint}
            setEndPoint={setEndPoint}
          />
          {errors.route && <ErrorMessage>{errors.route}</ErrorMessage>}
        </div>

        <FormGroup>
          <Label>Departure Time</Label>
          <Input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleInputChange}
          />
          {errors.departureTime && <ErrorMessage>{errors.departureTime}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Recurrence</Label>
          <Select
            name="recurrence"
            value={formData.recurrence}
            onChange={handleInputChange}
          >
            <option value="Single">Single Trip</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Preferred Gender</Label>
          <Select
            name="preferredGender"
            value={formData.preferredGender}
            onChange={handleInputChange}
          >
            <option value="No Preference">No Preference</option>
            <option value="Male">Male Only</option>
            <option value="Female">Female Only</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Available Seats</Label>
          <Input
            type="number"
            name="availableSeats"
            min="1"
            value={formData.availableSeats}
            onChange={handleInputChange}
          />
          {errors.availableSeats && <ErrorMessage>{errors.availableSeats}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Price per Seat</Label>
          <Input
            type="number"
            name="pricePerSeat"
            min="0"
            step="0.01"
            value={formData.pricePerSeat}
            onChange={handleInputChange}
          />
          {errors.pricePerSeat && <ErrorMessage>{errors.pricePerSeat}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Vehicle Type</Label>
          <Input
            type="text"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
            placeholder="e.g., Sedan, SUV"
          />
          {errors.vehicleType && <ErrorMessage>{errors.vehicleType}</ErrorMessage>}
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Creating Route...' : 'Create Route'}
        </SubmitButton>
        
        {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </form>
    </FormContainer>
  );
};

export default CreateCarpoolRoute; 