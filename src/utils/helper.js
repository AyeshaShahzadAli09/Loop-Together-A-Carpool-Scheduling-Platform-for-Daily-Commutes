//  function to check if input contains only alphabets
const validateAlphabetsOnly = (input) => {
  const regex = /^[A-Za-z\s]*$/;  // Allows only alphabets and spaces
  return regex.test(input);
};

// Function to validate available seats (should be a non-negative integer)
export const validateAvailableSeats = (seats) => {
  return seats > 0 && Number.isInteger(Number(seats));
};

// Function to validate price per seat (should be a non-negative number)
export const validatePricePerSeat = (price) => {
  return price > 0 && !isNaN(price);
};

// Function to validate departure date (only future dates allowed)
export const validateDepartureDate = (date) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date
  return date >= today;
};

// Function to validate form data with conditional check
export const validateFormData = (data, isFindRideForm = false) => {
  const errors = {};
  
  if (!validateAlphabetsOnly(data.name)) errors.name = "Name must contain only alphabets.";
  // if (!validateDepartureDate(data.departureDate)) errors.departureDate = "Invalid departure date.";
  if (!isFindRideForm)   
  {
    if (!validateAlphabetsOnly(data.name)) errors.name = "Name must contain only alphabets.";
    if (!validateAvailableSeats(data.availableSeats)) errors.availableSeats = "Available seats must be valid";
    if (!validatePricePerSeat(data.pricePerSeat)) errors.pricePerSeat = "Price per seat must be valid.";
    if (!validateAlphabetsOnly(data.vehicleType)) errors.name = "Vehicle Type must contain only alphabets.";
  }
  return errors;
};
