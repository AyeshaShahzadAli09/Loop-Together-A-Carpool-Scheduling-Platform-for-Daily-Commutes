import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  commuteDetails: {
    departureLocation: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    destination: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    preferredTimes: [Date],
    maxPrice: Number,
    preferredGender: {
      type: String,
      enum: ['Male', 'Female', 'No Preference']
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('UserPreferences', userPreferencesSchema);
