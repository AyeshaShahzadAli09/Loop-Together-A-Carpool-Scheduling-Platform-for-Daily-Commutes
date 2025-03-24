import Rating from '../models/Rating.js';
import Carpool from '../models/Carpool.js';
import RideRequest from '../models/RideRequest.js';
import { ApiError } from '../utils/ApiError.js';
import notificationService from '../services/notificationService.js';

// Submit a rating
export const submitRating = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const { rating, feedback } = req.body;

    if (!rating) {
      throw new ApiError(400, 'Rating is required');
    }

    // Verify user was a passenger on this ride
    const rideRequest = await RideRequest.findOne({
      carpool: rideId,
      passenger: req.user._id,
      status: 'Completed'
    }).populate('carpool');

    if (!rideRequest) {
      throw new ApiError(403, 'You were not a passenger on this ride');
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      carpool: rideId,
      passenger: req.user._id
    });

    if (existingRating) {
      throw new ApiError(400, 'You have already rated this ride');
    }

    // Create the rating
    const newRating = await Rating.create({
      carpool: rideId,
      passenger: req.user._id,
      driver: rideRequest.carpool.driver,
      rating,
      feedback: feedback || ''
    });

    // Notify the driver
    await notificationService.createNotification({
      user: rideRequest.carpool.driver,
      message: `A passenger has rated your ride ${rating}/5 stars.`,
      type: 'Rating',
      mode: 'driver',
      relatedEntity: rideId,
      refModel: 'Carpool',
      actionRequired: false,
      actionLink: `/driver/ratings`
    });

    res.status(201).json({
      success: true,
      data: newRating
    });
  } catch (error) {
    next(error);
  }
};

// Get driver ratings
export const getDriverRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ driver: req.user._id })
      .populate('carpool', 'route schedule')
      .populate('passenger', 'name profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: ratings
    });
  } catch (error) {
    next(error);
  }
}; 