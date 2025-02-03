import { Carpool } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

export const createCarpool = async (req, res, next) => {
  try {
    const {
      route,
      schedule,
      pricePerSeat,
      availableSeats,
      vehicleType,
      preferredGender,
      recurrence
    } = req.body;

    // Validate required fields
    if (!route || !schedule || !pricePerSeat || !availableSeats) {
      throw new ApiError(400, 'Missing required fields');
    }

    // Create new carpool
    const carpool = await Carpool.create({
      driver: req.user._id, // From auth middleware
      route: {
        type: 'LineString',
        coordinates: route.coordinates
      },
      schedule,
      pricePerSeat,
      availableSeats,
      vehicleType,
      preferredGender,
      recurrence
    });

    res.status(201).json({
      success: true,
      data: carpool
    });
  } catch (error) {
    next(error);
  }
};

export const getCarpools = async (req, res, next) => {
  try {
    const carpools = await Carpool.find()
      .populate('driver', 'name profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: carpools
    });
  } catch (error) {
    next(error);
  }
};

export const updateCarpool = async (req, res, next) => {
  try {
    const carpool = await Carpool.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!carpool) {
      throw new ApiError(404, 'Carpool not found');
    }

    res.status(200).json({
      success: true,
      data: carpool
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCarpool = async (req, res, next) => {
  try {
    const carpool = await Carpool.findByIdAndDelete(req.params.id);

    if (!carpool) {
      throw new ApiError(404, 'Carpool not found');
    }

    res.status(200).json({
      success: true,
      message: 'Carpool deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 