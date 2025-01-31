import { fetchDataByEndpoint, postDataToEndpoint } from "./apiClient";

// buildings endpoint
export const getBuildings = async () => {
  return await fetchDataByEndpoint("buildings");
};

export const getBuildingByCampus = async (campus) => {
  return await fetchDataByEndpoint(`buildings-by-campus?campus=${campus}`);
}