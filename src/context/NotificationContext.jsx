import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as notificationService from '../services/notificationService';
import { Car, Star, ThumbsUp } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

const notificationTypeIcons = {
  'RideUpdate': <Car className="h-5 w-5" />,
  'RateRide': <Star className="h-5 w-5" />,
  'Rating': <ThumbsUp className="h-5 w-5" />
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState('rider'); // Default to rider mode

  const fetchNotifications = useCallback(async (mode = currentMode, unreadOnly = false) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(mode, 20, 0, unreadOnly);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentMode]);

  const fetchUnreadCount = useCallback(async (mode = currentMode) => {
    if (!isAuthenticated) return;
    
    try {
      const count = await notificationService.getUnreadCount(mode);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    }
  }, [isAuthenticated, currentMode]);

  const markNotificationAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(notif => 
        notif._id === id ? { ...notif, read: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationService.markAllAsRead(currentMode);
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(notif => notif._id !== id));
      const deletedNotif = notifications.find(n => n._id === id);
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const switchMode = useCallback((mode) => {
    setCurrentMode(mode);
    fetchNotifications(mode);
    fetchUnreadCount(mode);
  }, [fetchNotifications, fetchUnreadCount]);

  // Load notifications and unread count when user logs in or mode changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications(currentMode);
      setTimeout(() => {
        fetchUnreadCount(currentMode);
      }, 300);
    }
  }, [isAuthenticated, currentMode, fetchNotifications, fetchUnreadCount]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchUnreadCount(currentMode);
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, currentMode, fetchUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    loading,
    currentMode,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    switchMode
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 