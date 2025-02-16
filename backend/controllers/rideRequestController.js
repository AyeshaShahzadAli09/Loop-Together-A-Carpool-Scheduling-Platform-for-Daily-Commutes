import RideRequest from '../models/RideRequest.js';
import Carpool from '../models/Carpool.js';
import { ApiError } from '../utils/ApiError.js';

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

    res.status(201).json({
      success: true,
      data: rideRequest
    });
  } catch (error) {
    next(error);
  }
}; 