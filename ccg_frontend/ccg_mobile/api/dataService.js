import { fetchDataByEndpoint } from "./apiClient";

// buildings endpoint
export const getBuildings = async () => {
  return await fetchDataByEndpoint("buildings");
};

export const getBuildingByCampus = async (campus) => {
  return await fetchDataByEndpoint(`buildings-by-campus?campus=${campus}`);
}

export const getDirections = async (profile, start, destination) => {
  return await fetchDataByEndpoint("directions/"+profile+"?start=" + start + "&end=" + destination);
}

export const getDirectionProfiles = async () => {
  return await fetchDataByEndpoint("directions")
}

export const getShuttleStops = async () => {
  return await fetchDataByEndpoint("shuttle_stops");
}

export const getUpcomingShuttles = async (lat, long) => {
  return await fetchDataByEndpoint("upcoming_shuttle?lat=" + lat + "&long=" + long);
}

export const getIndoorDirections = async (profile, start, destination) => {
  return await fetchDataByEndpoint("directions/indoor?start="+start+"&destination="+destination);
}