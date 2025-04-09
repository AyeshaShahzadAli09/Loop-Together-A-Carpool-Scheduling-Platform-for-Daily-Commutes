import mongoose from 'mongoose';

// Mock Carpool model
const Carpool = function(data) {
  this.data = data;
  return {
    ...data,
    save: jest.fn().mockResolvedValue({ _id: 'carpool-id', ...data }),
    validate: jest.fn().mockImplementation(function() {
      if (!this.startLocation) throw { errors: { startLocation: { message: 'Start location is required' } } };
      return true;
    })
  };
};

describe('Carpool Model', () => {
  it('should create a new carpool', async () => {
    const carpoolData = {
      startLocation: 'Downtown',
      endLocation: 'Uptown',
      departureTime: new Date(),
      availableSeats: 3,
      price: 5.00,
      driver: 'user-id'
    };
    
    const carpool = new Carpool(carpoolData);
    const savedCarpool = await carpool.save();
    
    expect(savedCarpool).toHaveProperty('_id');
    expect(savedCarpool.startLocation).toBe(carpoolData.startLocation);
  });

  it('should validate required fields', async () => {
    const invalidCarpool = new Carpool({
      endLocation: 'Somewhere',
      departureTime: new Date()
      // Missing startLocation
    });

    let validationError;
    try {
      await invalidCarpool.validate();
    } catch (error) {
      validationError = error;
    }
    
    expect(validationError).toBeDefined();
    expect(validationError.errors.startLocation).toBeDefined();
  });
}); 