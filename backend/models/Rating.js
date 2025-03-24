import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
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
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating; 