import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Bell, AlertCircle, Info, MessageSquare, Calendar, CreditCard, Car, Star, ThumbsUp } from 'lucide-react';
import styled from 'styled-components';

const NotificationsPanel = () => {
  const {
    notifications,
    loading,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    currentMode,
    unreadCount
  } = useNotifications();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedNotification, setExpandedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications(currentMode, activeFilter === 'unread');
  }, [currentMode, fetchNotifications, activeFilter]);

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    markNotificationAsRead(id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const handleActionClick = (notification) => {
    // Mark as read when user clicks on notification
    if (!notification.read) {
      markNotificationAsRead(notification._id);
    }
    
    // Toggle expanded state
    setExpandedNotification(expandedNotification === notification._id ? null : notification._id);
    
    // Navigate to the action link if clicked again while expanded
    if (expandedNotification === notification._id && notification.actionLink) {
      window.location.href = notification.actionLink;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'RideRequest':
        return <MessageSquare className="h-5 w-5" />;
      case 'RideOffer':
        return <Calendar className="h-5 w-5" />;
      case 'Payment':
        return <CreditCard className="h-5 w-5" />;
      case 'Reminder':
        return <Bell className="h-5 w-5" />;
      case 'RideUpdate':
        return <Car className="h-5 w-5" />;
      case 'RateRide':
        return <Star className="h-5 w-5" />;
      case 'Rating':
        return <ThumbsUp className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        
        <div className="flex gap-2">
          <FilterButton 
            active={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'unread'} 
            onClick={() => setActiveFilter('unread')}
          >
            Unread
          </FilterButton>
          {unreadCount > 0 && (
            <ActionButton onClick={() => {
              markAllNotificationsAsRead();
              // Optionally refresh notifications after marking all as read
              setTimeout(() => fetchNotifications(currentMode), 300);
            }}>
              Mark all as read
            </ActionButton>
          )}
        </div>
      </Header>

      <NotificationList>
        {loading ? (
          <LoadingState>
            <div className="loader"></div>
            <p>Loading notifications...</p>
          </LoadingState>
        ) : notifications.length === 0 ? (
          <EmptyState>
            <Bell className="h-16 w-16 text-gray-300" />
            <p className="text-lg text-gray-500">No notifications yet!</p>
          </EmptyState>
        ) : (
          <AnimatePresence>
            {notifications.map(notification => (
              <NotificationItem 
                key={notification._id}
                unread={!notification.read}
                actionRequired={notification.actionRequired}
                onClick={() => handleActionClick(notification)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex">
                  <div className="icon-container">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="content">
                    <div className="message">{notification.message}</div>
                    <div className="time">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </div>
                    
                    {expandedNotification === notification._id && notification.actionLink && (
                      <ActionLink>
                        <button>View Details</button>
                      </ActionLink>
                    )}
                  </div>
                </div>
                
                <div className="actions">
                  {!notification.read && (
                    <ActionIconButton 
                      onClick={(e) => handleMarkAsRead(e, notification._id)}
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </ActionIconButton>
                  )}
                  <ActionIconButton 
                    onClick={(e) => handleDelete(e, notification._id)}
                    title="Delete notification"
                    className="delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </ActionIconButton>
                </div>
              </NotificationItem>
            ))}
          </AnimatePresence>
        )}
      </NotificationList>
    </Container>
  );
};

// Styled Components
const Container = styled(motion.div)`
  background: rgba(15, 76, 70, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  color: #ffffff;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(to right, rgba(15, 76, 70, 0.8), rgba(23, 107, 98, 0.8));
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'transparent'};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const NotificationList = styled.div`
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: transparent;
`;

const NotificationItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-radius: 12px;
  background-color: ${props => props.unread ? 'rgba(0, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
  border-left: ${props => props.actionRequired ? '4px solid #ff8800' : props.unread ? '1px solid rgba(0, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: ${props => props.unread ? '0 0 15px rgba(0, 255, 255, 0.1)' : 'none'};
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #fff;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border-color: ${props => props.unread ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ActionIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  &.delete:hover {
    background-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
`;

const ActionLink = styled.div`
  margin-top: 12px;
  
  button {
    padding: 8px 16px;
    border-radius: 6px;
    background-color: rgba(0, 255, 255, 0.2);
    color: white;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    border: 1px solid rgba(0, 255, 255, 0.3);
    
    &:hover {
      background-color: rgba(0, 255, 255, 0.3);
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 16px;
  color: rgba(255, 255, 255, 0.6);
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 16px;
  color: rgba(255, 255, 255, 0.6);
  
  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top: 3px solid #4ade80;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default NotificationsPanel; 