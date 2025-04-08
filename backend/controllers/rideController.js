import Carpool from '../models/Carpool.js';

export const getAvailableRides = async (req, res, next) => {
  try {
    const { statuses } = req.query;
    
    // Default status filter supports both old and new ride status structure
    let statusFilter = ['Scheduled', 'Active'];
    
    // If custom statuses are provided in the query
    if (statuses && Array.isArray(statuses)) {
      statusFilter = statuses;
    }
    
    // Fetch rides with the specified statuses
    const rides = await Carpool.find({
      status: { $in: statusFilter },
      // Other filters as needed
    })
    .populate('driver', 'name profilePicture rating')
    .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    next(error);
  }
}; 