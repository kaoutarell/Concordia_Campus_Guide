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