import mongoose from 'mongoose';

const carpoolSchema = new mongoose.Schema({
  driver: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  route: {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString'
    },
    coordinates: [[Number]]
  },
  schedule: [{
    departureTime: Date,
    recurrence: {
      type: String,
      enum: ['Single', 'Daily', 'Weekly']
    }
  }],
  pricePerSeat: {
    type: Number,
    min: 0
  },
  availableSeats: {
    type: Number,
    min: 1,
    required: true
  },
  vehicleType: String,
  preferredGender: {
    type: String,
    enum: ['Male', 'Female', 'No Preference']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'InProgress', 'Completed', 'Cancelled', 'Active'],
    default: 'Scheduled'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  recurrence: {
    type: String,
    enum: ['Single', 'Daily', 'Weekly', 'Custom']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual fields for ride requests and ratings
carpoolSchema.virtual('rideRequests', {
  ref: 'RideRequest',
  localField: '_id',
  foreignField: 'carpool'
});

carpoolSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'carpool'
});

// Geospatial index
carpoolSchema.index({ route: '2dsphere' });

export default mongoose.model('Carpool', carpoolSchema); 