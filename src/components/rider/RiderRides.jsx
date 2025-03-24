import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const RiderRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRides();
    
    // Optional: Set up a refresh interval
    const intervalId = setInterval(fetchRides, 30000); // Refresh every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/ride-requests/rider`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Make sure we're setting the state with the correct data
      setRides(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rides:", error);
      toast.error("Failed to load your rides");
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default RiderRides; 