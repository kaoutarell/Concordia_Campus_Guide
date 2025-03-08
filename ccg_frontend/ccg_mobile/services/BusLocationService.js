const GET_SESSION_URL = "https://shuttle.concordia.ca/concordiabusmap/Map.aspx";
const GET_BUS_DATA_URL = "https://shuttle.concordia.ca/concordiabusmap/WebService/GService.asmx/GetGoogleObject";

class BusLocationService {
  static instance = null;
  busLocations = [];
  intervalId = null;

  constructor() {
    if (BusLocationService.instance) {
      throw new Error("Use BusLocationService.getInstance() instead of new BusLocationService().");
    }
    BusLocationService.instance = this;
  }

  static getInstance() {
    if (!BusLocationService.instance) {
      BusLocationService.instance = new BusLocationService();
    }
    return BusLocationService.instance;
  }

  /**
   * Fetch a fresh session cookie via a GET request.
   * The cookie is not stored; it is used immediately for the POST request.
   *
   * @returns {Promise<string|null>} The session cookie string if available, otherwise null.
   */
  async fetchSessionCookie() {
    try {
      const response = await fetch(GET_SESSION_URL, {
        method: "GET",
        headers: {
          Host: "shuttle.concordia.ca",
        },
      });
      return response.headers.get("set-cookie");
    } catch (error) {
      console.error("BusLocationService: Error fetching session cookie:", error);
      return null;
    }
  }

  /**
   * Fetch bus data by first obtaining a fresh session cookie and then making a POST request.
   * If no bus data is provided in the response, busLocations is set to an empty array.
   */
  async fetchBusData() {
    try {
      const sessionCookie = await this.fetchSessionCookie();

      const response = await fetch(GET_BUS_DATA_URL, {
        method: "POST",
        headers: {
          Host: "shuttle.concordia.ca",
          "Content-Length": "0",
          "Content-Type": "application/json; charset=UTF-8",
          ...(sessionCookie ? { Cookie: sessionCookie } : {}),
        },
        body: "",
      });

      const data = await response.json();
      if (Array.isArray(data?.d?.Points)) {
        const busPoints = data.d.Points.filter(point => point.ID?.startsWith("BUS"));
        this.busLocations = busPoints.map(point => ({
          id: point.ID,
          latitude: point.Latitude,
          longitude: point.Longitude,
        }));
      } else {
        this.busLocations = [];
        console.warn("BusLocationService: No bus data available in response", data);
      }
    } catch (error) {
      console.error("BusLocationService: Error fetching bus data", error);
      this.busLocations = [];
    }
  }

  /**
   * Start tracking bus locations every 5 seconds.
   *
   * @param {number} intervalMs - Interval between refreshes in milliseconds. Default is 5000 (5 seconds).
   */
  startTracking(intervalMs = 5000) {
    this.stopTracking();

    this.fetchBusData();
    this.intervalId = setInterval(() => {
      this.fetchBusData();
    }, intervalMs);
  }

  /**
   * Stop tracking bus locations.
   */
  stopTracking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Retrieve the latest bus locations.
   *
   * @returns {Array} An array of objects, each with { id, latitude, longitude }.
   */
  getBusLocations() {
    return this.busLocations;
  }
}

const busLocationService = BusLocationService.getInstance();
export default busLocationService;
export { BusLocationService };
