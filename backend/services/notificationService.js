import Notification from '../models/Notification.js';

/**
 * Notification Service - Handles notification generation for various events
 */
class NotificationService {
  /**
   * Create a notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Created notification
   */
  async createNotification(notificationData) {
    try {
      return await Notification.create(notificationData);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Generate ride request notifications
   * @param {Object} rideRequest - The ride request object
   * @param {String} driverId - ID of the driver
   * @param {String} riderId - ID of the rider
   * @param {String} status - Status of the ride request
   */
  async rideRequestNotification(rideRequest, driverId, riderId, status) {
    try {
      const driverMsg = this._getRideRequestMessageForDriver(status);
      const riderMsg = this._getRideRequestMessageForRider(status);
      
      if (driverMsg) {
        await this.createNotification({
          user: driverId,
          message: driverMsg,
          type: 'RideRequest',
          mode: 'driver',
          relatedEntity: rideRequest._id,
          refModel: 'RideRequest',
          actionRequired: ['requested', 'modified'].includes(status),
          actionLink: `/driver/requests/${rideRequest._id}`
        });
      }
      
      if (riderMsg) {
        await this.createNotification({
          user: riderId,
          message: riderMsg,
          type: 'RideRequest',
          mode: 'rider',
          relatedEntity: rideRequest._id,
          refModel: 'RideRequest',
          actionRequired: status === 'canceled_by_driver',
          actionLink: `/rider/requests/${rideRequest._id}`
        });
      }
    } catch (error) {
      console.error('Error generating ride request notifications:', error);
    }
  }

  /**
   * Generate carpool notifications
   * @param {Object} carpool - The carpool object
   * @param {String} driverId - ID of the driver
   * @param {Array} passengerIds - IDs of all passengers
   * @param {String} status - Status of the carpool
   * @param {String} initiatorId - ID of the user who initiated the action
   */
  async carpoolNotification(carpool, driverId, passengerIds, status, initiatorId) {
    try {
      const driverMsg = this._getCarpoolMessageForDriver(status, initiatorId === driverId);
      const passengerMsg = this._getCarpoolMessageForPassenger(status, initiatorId === driverId);
      
      if (driverMsg && driverId !== initiatorId) {
        await this.createNotification({
          user: driverId,
          message: driverMsg,
          type: 'RideOffer',
          mode: 'driver',
          relatedEntity: carpool._id,
          refModel: 'Carpool',
          actionRequired: ['passenger_joined', 'passenger_left'].includes(status),
          actionLink: `/driver/carpools/${carpool._id}`
        });
      }
      
      if (passengerMsg) {
        for (const passengerId of passengerIds) {
          // Don't notify the initiator
          if (passengerId === initiatorId) continue;
          
          await this.createNotification({
            user: passengerId,
            message: passengerMsg,
            type: 'RideOffer',
            mode: 'rider',
            relatedEntity: carpool._id,
            refModel: 'Carpool',
            actionRequired: status === 'canceled' || status === 'modified',
            actionLink: `/rider/carpools/${carpool._id}`
          });
        }
      }
    } catch (error) {
      console.error('Error generating carpool notifications:', error);
    }
  }

  /**
   * Generate verification notifications
   * @param {String} userId - User ID
   * @param {String} verificationType - Type of verification
   * @param {String} status - Status of verification
   */
  async verificationNotification(userId, verificationType, status) {
    try {
      const message = this._getVerificationMessage(verificationType, status);
      
      if (message) {
        await this.createNotification({
          user: userId,
          message,
          type: 'Verification',
          mode: verificationType === 'driver_license' ? 'driver' : 'both',
          refModel: 'User',
          relatedEntity: userId,
          actionRequired: status === 'rejected',
          actionLink: '/profile/verification'
        });
      }
    } catch (error) {
      console.error('Error generating verification notification:', error);
    }
  }

  /**
   * Generate reminder notification
   * @param {String} userId - User ID
   * @param {String} entityId - ID of the related entity
   * @param {String} entityType - Type of entity
   * @param {String} mode - Mode (rider/driver)
   * @param {String} message - Custom message
   */
  async reminderNotification(userId, entityId, entityType, mode, message) {
    try {
      await this.createNotification({
        user: userId,
        message,
        type: 'Reminder',
        mode,
        relatedEntity: entityId,
        refModel: entityType,
        actionRequired: true,
        actionLink: mode === 'rider' ? `/rider/${entityType.toLowerCase()}s/${entityId}` : `/driver/${entityType.toLowerCase()}s/${entityId}`
      });
    } catch (error) {
      console.error('Error generating reminder notification:', error);
    }
  }

  /**
   * Generate payment notification
   * @param {String} userId - User ID
   * @param {String} entityId - ID of the related entity
   * @param {String} mode - Mode (rider/driver)
   * @param {String} status - Payment status
   * @param {Number} amount - Payment amount
   */
  async paymentNotification(userId, entityId, mode, status, amount) {
    try {
      const message = this._getPaymentMessage(status, amount, mode);
      
      if (message) {
        await this.createNotification({
          user: userId,
          message,
          type: 'Payment',
          mode,
          relatedEntity: entityId,
          refModel: 'RideRequest',
          actionRequired: status === 'pending',
          actionLink: mode === 'rider' ? `/rider/payments` : `/driver/payments`
        });
      }
    } catch (error) {
      console.error('Error generating payment notification:', error);
    }
  }

  /**
   * Get ride update message for rider
   * @param {String} status - Status of the ride
   */
  _getRideUpdateMessageForRider(status) {
    const messages = {
      'started': 'Your ride has started! The driver is on the way.',
      'picked_up': 'You have been picked up by the driver.',
      'completed': 'Your ride has been completed. Please rate your experience!'
    };
    return messages[status] || null;
  }

  /**
   * Generate ride update notifications
   * @param {Object} ride - The ride object
   * @param {String} riderId - ID of the rider
   * @param {String} status - Status of the ride update
   */
  async rideUpdateNotification(ride, riderId, status) {
    try {
      const riderMsg = this._getRideUpdateMessageForRider(status);
      
      if (riderMsg) {
        await this.createNotification({
          user: riderId,
          message: riderMsg,
          type: 'RideUpdate',
          mode: 'rider',
          relatedEntity: ride._id,
          refModel: 'Carpool',
          actionRequired: status === 'completed',
          actionLink: status === 'completed' 
            ? `/rider/rate/${ride._id}` 
            : `/rider/rides/${ride._id}`
        });
      }
    } catch (error) {
      console.error('Error generating ride update notifications:', error);
    }
  }

  // Private helper methods for generating messages
  _getRideRequestMessageForDriver(status) {
    switch (status) {
      case 'requested':
        return 'You have a new ride request from a passenger.';
      case 'accepted':
        return null; // Driver initiated this action
      case 'rejected':
        return null; // Driver initiated this action
      case 'canceled_by_rider':
        return 'A passenger has canceled their ride request.';
      case 'modified':
        return 'A passenger has modified their ride request.';
      case 'completed':
        return 'A ride has been marked as completed.';
      default:
        return null;
    }
  }

  _getRideRequestMessageForRider(status) {
    switch (status) {
      case 'requested':
        return null; // Rider initiated this action
      case 'accepted':
        return 'Your ride request has been accepted by a driver.';
      case 'rejected':
        return 'Your ride request has been rejected by a driver.';
      case 'canceled_by_driver':
        return 'The driver has canceled your ride.';
      case 'modified':
        return null; // Rider initiated this action
      case 'completed':
        return 'Your ride has been marked as completed.';
      default:
        return null;
    }
  }

  _getCarpoolMessageForDriver(status, isInitiator) {
    if (isInitiator) return null;
    
    switch (status) {
      case 'passenger_joined':
        return 'A new passenger has joined your carpool.';
      case 'passenger_left':
        return 'A passenger has left your carpool.';
      case 'modified':
        return null; // Driver initiated this action
      case 'canceled':
        return null; // Driver initiated this action
      default:
        return null;
    }
  }

  _getCarpoolMessageForPassenger(status, driverInitiated) {
    switch (status) {
      case 'modified':
        return 'The driver has modified carpool details.';
      case 'canceled':
        return 'The driver has canceled the carpool.';
      case 'passenger_joined':
        return driverInitiated ? null : 'A new passenger has joined the carpool.';
      case 'passenger_left':
        return driverInitiated ? null : 'A passenger has left the carpool.';
      default:
        return null;
    }
  }

  _getVerificationMessage(type, status) {
    const typeName = type === 'driver_license' ? 'driver\'s license' : 'ID';
    
    switch (status) {
      case 'pending':
        return `Your ${typeName} verification is being processed.`;
      case 'approved':
        return `Your ${typeName} has been successfully verified.`;
      case 'rejected':
        return `Your ${typeName} verification was rejected. Please submit again.`;
      default:
        return null;
    }
  }

  _getPaymentMessage(status, amount, mode) {
    const formattedAmount = amount.toFixed(2);
    
    if (mode === 'rider') {
      switch (status) {
        case 'pending':
          return `You have a pending payment of $${formattedAmount}.`;
        case 'completed':
          return `Your payment of $${formattedAmount} has been processed.`;
        case 'failed':
          return `Your payment of $${formattedAmount} failed. Please try again.`;
        default:
          return null;
      }
    } else {
      switch (status) {
        case 'pending':
          return `A passenger has initiated a payment of $${formattedAmount}.`;
        case 'completed':
          return `You have received a payment of $${formattedAmount}.`;
        case 'failed':
          return `A payment of $${formattedAmount} from a passenger has failed.`;
        default:
          return null;
      }
    }
  }
}

export default new NotificationService(); 