

class InvalidCoordinatesError(Exception):
    """Exception raised for invalid coordinates input."""
    def __init__(self, message="Invalid coordinate format or missing parameters. Use 'lon,lat'."):
        self.message = message
        super().__init__(self.message)

class BuildingNotFoundError(Exception):
    """Exception raised when no nearby building is found."""
    def __init__(self, message="No nearby building found for the given location."):
        self.message = message
        super().__init__(self.message)

class ShuttleStopNotFoundError(Exception):
    """Exception raised when shuttle stops cannot be found for the given campuses."""

    def __init__(self, message="Shuttle stop not found for one or both campuses."):
        self.message = message
        super().__init__(self.message)