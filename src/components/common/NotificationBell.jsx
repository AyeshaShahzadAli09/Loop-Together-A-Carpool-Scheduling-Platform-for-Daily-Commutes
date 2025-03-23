import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const { unreadCount, currentMode, fetchUnreadCount } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount(currentMode);
  }, [currentMode, fetchUnreadCount]);

  const handleClick = () => {
    navigate(`/${currentMode === 'rider' ? 'rider' : 'driver'}/dashboard/notifications`);
  };

  return (
    <div className="relative cursor-pointer" onClick={handleClick}>
      <Bell className="w-6 h-6 text-gray-600" />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 