import RideRequest from '../models/RideRequest.js';
import Carpool from '../models/Carpool.js';
import { ApiError } from '../utils/ApiError.js';
import notificationService from '../services/notificationService.js';

export const createRideRequest = async (req, res, next) => {
  try {
    const { rideId, seatsRequested } = req.body;
    if (!rideId || !seatsRequested) {
      throw new ApiError(400, 'Missing required fields: rideId and seatsRequested are required');
    }

    // Verify the ride exists
    const ride = await Carpool.findById(rideId);
    if (!ride) {
      throw new ApiError(404, 'Ride not found');
    }

    // Create a new ride request. The logged-in user is the passenger.
    const rideRequest = await RideRequest.create({
      carpool: rideId,
      passenger: req.user._id,
      status: 'Pending', // default
      seatsRequested: seatsRequested
    });

    // Create notification for the driver
    await notificationService.rideRequestNotification(
      rideRequest,
      ride.driver,
      req.user._id,
      'requested'
    );

    res.status(201).json({
      success: true,
      data: rideRequest
    });
  } catch (error) {
    next(error);
  }
};

// Get all ride requests for a driver
export const getDriverRideRequests = async (req, res, next) => {
  try {
    // Find all carpools created by this driver
    const driverCarpools = await Carpool.find({ driver: req.user._id });
    const carpoolIds = driverCarpools.map(carpool => carpool._id);

    // Get all ride requests for these carpools with populated carpool details
    const rideRequests = await RideRequest.find({
      carpool: { $in: carpoolIds }
    })
    .populate('passenger', 'name profilePicture gender phoneNumber')
    .populate({
      path: 'carpool',
      select: 'route schedule pricePerSeat vehicleType vehicleModel availableSeats preferredGender status',
      populate: {
        path: 'driver',
        select: 'name profilePicture'
      }
    })
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: rideRequests
    });
  } catch (error) {
    next(error);
  }
};

// Accept a ride request
export const acceptRideRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    const rideRequest = await RideRequest.findById(requestId)
      .populate('carpool');

    if (!rideRequest) {
      throw new ApiError(404, 'Ride request not found');
    }

    // Verify this driver owns the carpool
    const carpool = await Carpool.findOne({
      _id: rideRequest.carpool._id,
      driver: req.user._id
    });

    if (!carpool) {
      throw new ApiError(403, 'Not authorized to manage this ride request');
    }

    // Check if enough seats are available
    if (carpool.availableSeats < rideRequest.seatsRequested) {
      throw new ApiError(400, 'Not enough seats available');
    }

    // Update ride request status
    rideRequest.status = 'Accepted';
    await rideRequest.save();

    // Update available seats in carpool
    carpool.availableSeats -= rideRequest.seatsRequested;
    await carpool.save();

    // Create notification for the passenger
    await notificationService.rideRequestNotification(
      rideRequest,
      req.user._id,
      rideRequest.passenger,
      'accepted'
    );

    res.status(200).json({
      success: true,
      message: 'Ride request accepted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Reject a ride request
export const rejectRideRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    const rideRequest = await RideRequest.findById(requestId)
      .populate('carpool');

    if (!rideRequest) {
      throw new ApiError(404, 'Ride request not found');
    }

    // Verify this driver owns the carpool
    const carpool = await Carpool.findOne({
      _id: rideRequest.carpool._id,
      driver: req.user._id
    });

    if (!carpool) {
      throw new ApiError(403, 'Not authorized to manage this ride request');
    }

    // Update ride request status
    rideRequest.status = 'Rejected';
    await rideRequest.save();

    // Create notification for the passenger
    await notificationService.rideRequestNotification(
      rideRequest,
      req.user._id,
      rideRequest.passenger,
      'rejected'
    );

    res.status(200).json({
      success: true,
      message: 'Ride request rejected successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get accepted passengers for a specific ride
export const getRidePassengers = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    // Verify this driver owns the carpool
    const carpool = await Carpool.findOne({
      _id: rideId,
      driver: req.user._id
    });

    if (!carpool) {
      throw new ApiError(403, 'Not authorized to view this ride\'s passengers');
    }

    const passengers = await RideRequest.find({
      carpool: rideId,
      status: 'Accepted'
    })
    .populate('passenger', 'name profilePicture gender phoneNumber')
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: passengers
    });
  } catch (error) {
    next(error);
  }
};

// Get all ride requests for a user (passenger)
export const getUserRideRequests = async (req, res, next) => {
  try {
    // Get all ride requests made by this user with populated carpool details
    const rideRequests = await RideRequest.find({
      passenger: req.user._id
    })
    .populate({
      path: 'carpool',
      select: 'route schedule pricePerSeat vehicleType vehicleModel availableSeats preferredGender status',
      populate: {
        path: 'driver',
        select: 'name profilePicture'
      }
    })
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: rideRequests
    });
  } catch (error) {
    next(error);
  }
}; 