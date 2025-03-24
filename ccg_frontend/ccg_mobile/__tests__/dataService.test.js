import {
  getBuildings,
  getBuildingByCampus,
  getDirections,
  getDirectionProfiles,
  getShuttleStops,
  getUpcomingShuttles,
  getPointOfInterests,
  getIndoorDirections,
} from "../api/dataService";
import { fetchDataByEndpoint } from "../api/apiClient";

// Mock apiClient fetchDataByEndpoint
jest.mock("../api/apiClient", () => ({
  fetchDataByEndpoint: jest.fn(),
}));

describe("dataService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBuildings", () => {
    it("calls fetchDataByEndpoint with correct endpoint", async () => {
      const mockData = [{ id: 1, name: "Building 1" }];
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getBuildings();

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("buildings");
      expect(result).toEqual(mockData);
    });
  });

  describe("getBuildingByCampus", () => {
    it("calls fetchDataByEndpoint with correct campus parameter", async () => {
      const mockData = [{ id: 1, name: "Building 1", campus: "SGW" }];
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getBuildingByCampus("SGW");

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("buildings-by-campus?campus=SGW");
      expect(result).toEqual(mockData);
    });
  });

  describe("getDirections", () => {
    it("calls fetchDataByEndpoint with correct parameters", async () => {
      const mockData = { route: "test route" };
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getDirections("walking", "45.497,-73.579", "45.495,-73.577");

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("directions/walking?start=45.497,-73.579&end=45.495,-73.577");
      expect(result).toEqual(mockData);
    });
  });

  describe("getDirectionProfiles", () => {
    it("calls fetchDataByEndpoint with correct endpoint", async () => {
      const mockData = ["walking", "driving", "cycling"];
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getDirectionProfiles();

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("directions");
      expect(result).toEqual(mockData);
    });
  });

  describe("getShuttleStops", () => {
    it("calls fetchDataByEndpoint with correct endpoint", async () => {
      const mockData = [
        { id: 1, name: "Stop 1" },
        { id: 2, name: "Stop 2" },
      ];
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getShuttleStops();

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("shuttle_stops");
      expect(result).toEqual(mockData);
    });
  });

  describe("getUpcomingShuttles", () => {
    it("calls fetchDataByEndpoint with correct parameters", async () => {
      const mockData = { next_shuttle: "10 mins" };
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getUpcomingShuttles("45.497", "-73.579");

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("upcoming_shuttle?lat=45.497&long=-73.579");
      expect(result).toEqual(mockData);
    });
  });

  describe("getPointOfInterests", () => {
    it("calls fetchDataByEndpoint with no parameters", async () => {
      const mockData = [{ id: 1, name: "POI 1" }];
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getPointOfInterests();

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("poi");
      expect(result).toEqual([{ id: 1, name: "POI 1", building_code: "" }]);
    });

    it("calls fetchDataByEndpoint with category parameter", async () => {
      const mockData = [{ id: 1, name: "POI 1" }];
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getPointOfInterests("restaurant");

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("poi?category=restaurant");
      expect(result).toEqual([{ id: 1, name: "POI 1", building_code: "" }]);
    });

    it("calls fetchDataByEndpoint with campus parameter", async () => {
      const mockData = [{ id: 1, name: "POI 1" }];
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getPointOfInterests(null, "SGW");

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("poi?campus=SGW");
      expect(result).toEqual([{ id: 1, name: "POI 1", building_code: "" }]);
    });

    it("calls fetchDataByEndpoint with location parameters", async () => {
      const mockData = [{ id: 1, name: "POI 1" }];
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getPointOfInterests(null, null, "-73.579", "45.497");

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("poi?long=-73.579&lat=45.497");
      expect(result).toEqual([{ id: 1, name: "POI 1", building_code: "" }]);
    });

    it("calls fetchDataByEndpoint with all parameters", async () => {
      const mockData = [{ id: 1, name: "POI 1" }];
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getPointOfInterests("restaurant", "SGW", "-73.579", "45.497");

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("poi?category=restaurant&campus=SGW&long=-73.579&lat=45.497");
      expect(result).toEqual([{ id: 1, name: "POI 1", building_code: "" }]);
    });
  });

  describe("getIndoorDirections", () => {
    it("calls fetchDataByEndpoint with correct parameters", async () => {
      const mockData = { route: "indoor route" };
      fetchDataByEndpoint.mockResolvedValueOnce(mockData);

      const result = await getIndoorDirections(true, "H-823", "H-907");

      expect(fetchDataByEndpoint).toHaveBeenCalledWith("directions/indoor?start=H-823&destination=H-907&disabled=true");
      expect(result).toEqual(mockData);
    });
  });
});
