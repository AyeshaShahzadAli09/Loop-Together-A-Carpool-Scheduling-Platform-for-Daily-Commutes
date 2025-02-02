import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documents: [{
    type: {
      type: String,
      enum: ['ID Card', 'Driver License', 'Vehicle']
    },
    url: String
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  feedback: String
}, {
  timestamps: true
});

export default mongoose.model('Verification', verificationSchema); 