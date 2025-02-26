import transformLocation from '../utils/transformCurrentLoc';

describe('transformLocation', () => {
  beforeEach(() => {
    // Mock console.error before each test
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the original console.error after each test
    console.error.mockRestore();
  });

  it('should properly transform a valid location object', () => {
    // Arrange
    const mockLocation = {
      coords: {
        latitude: 45.4972159,
        longitude: -73.5789256
      }
    };

    // Act
    const result = transformLocation(mockLocation);

    // Assert
    expect(result).toEqual({
      building_code: "CURR_LOC",
      civic_address: "Your Location",
      id: 1,
      location: {
        latitude: 45.4972159,
        longitude: -73.5789256
      },
      name: "Current location"
    });
  });

  it('should return null for null input', () => {
    // Act
    const result = transformLocation(null);

    // Assert
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Invalid location object:', null);
  });

  it('should return null for undefined input', () => {
    // Act
    const result = transformLocation(undefined);

    // Assert
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Invalid location object:', undefined);
  });

  it('should return null when coords property is missing', () => {
    // Arrange
    const invalidLocation = { timestamp: 123456789 };

    // Act
    const result = transformLocation(invalidLocation);

    // Assert
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Invalid location object:', invalidLocation);
  });

  it('should return null when coords property is null', () => {
    // Arrange
    const invalidLocation = { coords: null };

    // Act
    const result = transformLocation(invalidLocation);

    // Assert
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Invalid location object:', invalidLocation);
  });
});