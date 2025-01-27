import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: String,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  isDriver: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  driverLicense: { type: String, select: false },
  vehiclePlate: String,
  isVerified: { type: Boolean, default: false },
  preferredPaymentMethods: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes
userSchema.index({ email: 1 });
userSchema.index({ isDriver: 1, isVerified: 1 });

const User = mongoose.model('User', userSchema);

export default User; 