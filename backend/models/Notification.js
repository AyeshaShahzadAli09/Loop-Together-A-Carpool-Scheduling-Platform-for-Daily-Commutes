import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['RideRequest', 'RideOffer', 'RideUpdate', 'RateRide', 'Verification', 'Cancellation', 'Reminder', 'Payment', 'System']
  },
  mode: {
    type: String,
    enum: ['rider', 'driver', 'both'],
    required: true
  },
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'refModel'
  },
  refModel: {
    type: String,
    enum: ['RideRequest', 'Carpool', 'User', 'Verification'],
    default: 'RideRequest'
  },
  read: {
    type: Boolean,
    default: false
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionLink: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// TTL index for 30 days expiration
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
// Index for faster querying by user and mode
notificationSchema.index({ user: 1, mode: 1, read: 1 });

export default mongoose.model('Notification', notificationSchema); 