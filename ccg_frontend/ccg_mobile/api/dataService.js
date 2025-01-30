import { fetchDataByEndpoint, postDataToEndpoint } from "./apiClient";

// buildings endpoint
export const getBuildings = async () => {
  return await fetchDataByEndpoint("buildings");
};