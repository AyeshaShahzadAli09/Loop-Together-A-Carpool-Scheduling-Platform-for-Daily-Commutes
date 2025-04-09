import React from 'react';
import styled from 'styled-components';
import { useLocationName } from '../../hooks/useLocationName';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingText = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
`;

const LocationText = styled.div`
  color: #fff;
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
`;

const LocationDisplay = ({ lat, lng, type = 'from', showLabel = true }) => {
  const { locationName, error } = useLocationName(lat, lng);

  return (
    <Container>
      <FaMapMarkerAlt color={type === 'from' ? '#4ade80' : '#ef4444'} />
      <div>
        {showLabel && <Label>{type === 'from' ? 'From' : 'To'}</Label>}
        <LocationText>
          {locationName === 'Loading...' ? (
            <LoadingText>Fetching location name...</LoadingText>
          ) : (
            locationName
          )}
        </LocationText>
      </div>
    </Container>
  );
};

export default LocationDisplay; 