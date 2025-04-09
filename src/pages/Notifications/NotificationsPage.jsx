import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Check, Trash2, AlertCircle, Bell } from 'lucide-react';

const NotificationsPage = () => {
  const { mode } = useParams();
  const { 
    notifications, 
    loading, 
    switchMode, 
    fetchNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    deleteNotification
  } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (mode) {
      switchMode(mode);
    }
    fetchNotifications(mode);
  }, [mode, switchMode, fetchNotifications]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchNotifications(mode, tab === 'unread');
  };

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleDelete = (id) => {
    deleteNotification(id);
  };

  const handleActionClick = (notification) => {
    // Mark as read when user clicks on actionable notification
    if (!notification.read) {
      markNotificationAsRead(notification._id);
    }
    
    // Navigate to the action link
    if (notification.actionLink) {
      window.location.href = notification.actionLink;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <Check className="w-4 h-4 mr-1" />
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button 
            className={`py-2 px-1 ${activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange('all')}
          >
            All
          </button>
          <button 
            className={`py-2 px-1 ${activeTab === 'unread' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange('unread')}
          >
            Unread
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <div className="flex justify-center mb-4">
            <Bell className="w-12 h-12" />
          </div>
          <p className="text-lg">No notifications to display</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`p-4 rounded-lg border ${notification.read ? 'bg-white' : 'bg-blue-50'} relative`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <div 
                    className={`mb-2 ${notification.actionRequired ? 'font-bold' : ''} ${notification.read ? 'text-gray-700' : 'text-black'}`}
                    onClick={() => notification.actionLink && handleActionClick(notification)}
                  >
                    {notification.actionRequired && (
                      <AlertCircle className="inline-block w-4 h-4 mr-2 text-yellow-500" />
                    )}
                    <span className={notification.actionLink ? "cursor-pointer hover:underline" : ""}>
                      {notification.message}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <button 
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Mark as read"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(notification._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {notification.type && (
                <div className="absolute top-4 right-4 text-xs px-2 py-1 bg-gray-200 rounded-full">
                  {notification.type}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage; 