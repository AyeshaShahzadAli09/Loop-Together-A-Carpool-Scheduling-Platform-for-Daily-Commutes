import { Carpool } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import RideRequest from '../models/RideRequest.js';
import notificationService from '../services/notificationService.js';

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
    // Find the carpool before updating
    const originalCarpool = await Carpool.findById(req.params.id);
    
    if (!originalCarpool) {
      throw new ApiError(404, 'Carpool not found');
    }
    
    // Check if user is the driver
    if (originalCarpool.driver.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to update this carpool');
    }

    const carpool = await Carpool.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Find all passengers with accepted ride requests
    const acceptedRequests = await RideRequest.find({
      carpool: carpool._id,
      status: 'Accepted'
    });
    
    const passengerIds = acceptedRequests.map(request => request.passenger);
    
    // Create notifications for all passengers
    if (passengerIds.length > 0) {
      await notificationService.carpoolNotification(
        carpool,
        carpool.driver,
        passengerIds,
        'modified',
        req.user._id
      );
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
    const carpool = await Carpool.findById(req.params.id);

    if (!carpool) {
      throw new ApiError(404, 'Carpool not found');
    }
    
    // Check if user is the driver
    if (carpool.driver.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to delete this carpool');
    }
    
    // Find all passengers with accepted ride requests
    const acceptedRequests = await RideRequest.find({
      carpool: carpool._id,
      status: 'Accepted'
    });
    
    const passengerIds = acceptedRequests.map(request => request.passenger);
    
    // Delete the carpool
    await Carpool.findByIdAndDelete(req.params.id);
    
    // Create notifications for all passengers
    if (passengerIds.length > 0) {
      await notificationService.carpoolNotification(
        carpool,
        carpool.driver,
        passengerIds,
        'canceled',
        req.user._id
      );
    }

    res.status(200).json({
      success: true,
      message: 'Carpool deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 