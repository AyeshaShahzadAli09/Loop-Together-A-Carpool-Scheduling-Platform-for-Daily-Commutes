import { useLocationName } from '../../hooks/useLocationName';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LocationDisplay = ({ lat, lng, type = 'from' }) => {
  const { locationName } = useLocationName(lat, lng);

  return (
    <div className="flex items-center gap-2">
      <FaMapMarkerAlt className={type === 'from' ? 'text-green-500' : 'text-red-500'} />
      <div>
        <div className="text-sm text-gray-500">{type === 'from' ? 'From' : 'To'}:</div>
        <div className="text-base">{locationName}</div>
      </div>
    </div>
  );
};

export default LocationDisplay; 