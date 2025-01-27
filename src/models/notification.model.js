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
    enum: ['RideRequest', 'Verification', 'Cancellation', 'Reminder']
  },
  relatedEntity: mongoose.Schema.Types.ObjectId,
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// TTL index for 30 days expiration
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model('Notification', notificationSchema);
