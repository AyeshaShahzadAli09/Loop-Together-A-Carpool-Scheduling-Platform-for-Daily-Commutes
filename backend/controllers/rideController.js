import Carpool from '../models/Carpool.js';

export const getAvailableRides = async (req, res, next) => {
  try {
    // Only fetch rides that are active
    const rides = await Carpool.find({ status: 'Active' })
      .populate('driver', 'name profilePicture')
      .sort('-createdAt');
    res.status(200).json({
      success: true,
      data: rides
    });
  } catch (error) {
    next(error);
  }
}; 