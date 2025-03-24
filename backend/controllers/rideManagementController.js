import Carpool from '../models/Carpool.js';
import RideRequest from '../models/RideRequest.js';
import { ApiError } from '../utils/ApiError.js';
import notificationService from '../services/notificationService.js';

// Start a ride
export const startRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    
    // Verify this driver owns the carpool
    const carpool = await Carpool.findOne({
      _id: rideId,
      driver: req.user._id
    });

    if (!carpool) {
      throw new ApiError(403, 'Not authorized to start this ride');
    }

    if (carpool.status !== 'Scheduled' && carpool.status !== 'Active') {
      throw new ApiError(400, 'This ride cannot be started');
    }

    // Update ride status
    carpool.status = 'InProgress';
    carpool.startTime = new Date();
    await carpool.save();

    // Notify all accepted passengers that the ride has started
    const acceptedPassengers = await RideRequest.find({
      carpool: rideId,
      status: 'Accepted'
    });

    for (const passenger of acceptedPassengers) {
      await notificationService.createNotification({
        user: passenger.passenger,
        message: 'Your ride has started! The driver is on the way.',
        type: 'RideUpdate',
        mode: 'rider',
        relatedEntity: rideId,
        refModel: 'Carpool',
        actionRequired: false,
        actionLink: `/rider/rides/${rideId}`
      });
    }

    res.status(200).json({
      success: true,
      data: carpool,
      passengers: acceptedPassengers
    });
  } catch (error) {
    next(error);
  }
};

// Mark passenger as picked up
export const pickupPassenger = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    
    // Find the ride request
    const rideRequest = await RideRequest.findById(requestId)
      .populate('carpool');
    
    if (!rideRequest) {
      throw new ApiError(404, 'Ride request not found');
    }

    // Verify this driver owns the carpool
    if (rideRequest.carpool.driver.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to update this passenger');
    }

    // Verify the ride is in progress
    if (rideRequest.carpool.status !== 'InProgress') {
      throw new ApiError(400, 'The ride must be in progress to pick up passengers');
    }

    // Update passenger status
    rideRequest.status = 'PickedUp';
    rideRequest.pickupTime = new Date();
    await rideRequest.save();

    // Notify the passenger
    await notificationService.createNotification({
      user: rideRequest.passenger,
      message: 'You have been picked up by the driver.',
      type: 'RideUpdate',
      mode: 'rider',
      relatedEntity: rideRequest.carpool._id,
      refModel: 'Carpool',
      actionRequired: false,
      actionLink: `/rider/rides/${rideRequest.carpool._id}`
    });

    res.status(200).json({
      success: true,
      data: rideRequest
    });
  } catch (error) {
    next(error);
  }
};

// Complete ride
export const completeRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    
    // Verify this driver owns the carpool
    const carpool = await Carpool.findOne({
      _id: rideId,
      driver: req.user._id
    });

    if (!carpool) {
      throw new ApiError(403, 'Not authorized to complete this ride');
    }

    if (carpool.status !== 'InProgress') {
      throw new ApiError(400, 'This ride is not in progress');
    }

    // Update ride status
    carpool.status = 'Completed';
    carpool.endTime = new Date();
    await carpool.save();

    // Find all passengers and update their status
    const rideRequests = await RideRequest.find({
      carpool: rideId,
      status: { $in: ['Accepted', 'PickedUp'] }
    });

    for (const request of rideRequests) {
      request.status = 'Completed';
      await request.save();

      // Notify passengers to rate the ride
      await notificationService.createNotification({
        user: request.passenger,
        message: 'Your ride has been completed. Please rate your experience!',
        type: 'RateRide',
        mode: 'rider',
        relatedEntity: rideId,
        refModel: 'Carpool',
        actionRequired: true,
        actionLink: `/rider/rate/${rideId}`
      });
    }

    res.status(200).json({
      success: true,
      data: carpool
    });
  } catch (error) {
    next(error);
  }
};

// Get active rides for driver
export const getActiveRides = async (req, res, next) => {
  try {
    // Find rides that are in progress and belong to this driver
    const activeRides = await Carpool.find({
      driver: req.user._id,
      status: 'InProgress'
    });

    // For each ride, get the count of passengers
    const ridesWithPassengerCount = await Promise.all(
      activeRides.map(async (ride) => {
        const passengerCount = await RideRequest.countDocuments({
          carpool: ride._id,
          status: { $in: ['Accepted', 'PickedUp'] }
        });

        return {
          ...ride.toObject(),
          passengerCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: ridesWithPassengerCount
    });
  } catch (error) {
    next(error);
  }
}; 