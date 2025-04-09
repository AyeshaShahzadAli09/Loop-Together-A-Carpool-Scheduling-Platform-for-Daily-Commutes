import mongoose from 'mongoose';

const rideRequestSchema = new mongoose.Schema({
  carpool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carpool',
    required: true
  },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'PickedUp', 'Completed'],
    default: 'Pending'
  },
  seatsRequested: {
    type: Number,
    min: 1,
    required: true
  },
  pickupTime: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index
rideRequestSchema.index({ carpool: 1, status: 1 });

export default mongoose.model('RideRequest', rideRequestSchema); 