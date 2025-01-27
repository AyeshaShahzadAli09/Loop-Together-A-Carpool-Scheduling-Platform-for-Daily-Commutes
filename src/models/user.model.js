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

// Clear existing indexes
userSchema.indexes().forEach(index => {
  userSchema.index(index[0], { ...index[1], background: true });
});

// Define indexes explicitly
userSchema.index({ email: 1 }, { unique: true, background: true });
userSchema.index({ isDriver: 1, isVerified: 1 }, { background: true });
userSchema.index({ isAdmin: 1 }, { background: true });

const User = mongoose.model('User', userSchema);

export default User; 