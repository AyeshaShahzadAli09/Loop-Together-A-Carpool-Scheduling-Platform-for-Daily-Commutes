import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  carpool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carpool',
    required: true
  },
  givenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comments: String
}, {
  timestamps: true
});

feedbackSchema.index({ carpool: 1 });
feedbackSchema.index({ givenBy: 1 });

export default mongoose.model('Feedback', feedbackSchema);
