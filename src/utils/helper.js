// helper.js

// Function to validate vehicle number (format: letters and numbers, e.g., ABC1234)
export const validateVehicleNumber = (vehicleNumber) => {
    const regex = /^[A-Z0-9]{6,10}$/i; // Adjust the regex based on your expected vehicle number format
    return regex.test(vehicleNumber);
  };
  
// Function to validate available seats (should be a non-negative integer)
export const validateAvailableSeats = (seats) => {
  return seats > 0;
};

// Function to validate price per seat (should be a non-negative number)
export const validatePricePerSeat = (price) => {
  return price > 0;
};
