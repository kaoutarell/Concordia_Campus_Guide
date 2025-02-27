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

export const getPointOfInterests = async (category = null, campus = null, long = null, lat = null) => {
  let endpoint = "poi";
  if (category) {
    endpoint += `?category=${category}`;
  }
  if (campus) {
    endpoint += category ? `&campus=${campus}` : `?campus=${campus}`;
  }
  if (long && lat) {
    endpoint += (category || campus) ? `&long=${long}&lat=${lat}` : `?long=${long}&lat=${lat}`;
  }
  return await fetchDataByEndpoint(endpoint);
}

export const getPointOfInterestsCategories = async () => {
  return await fetchDataByEndpoint("poi-categories");
}

export const getDepartments = async () => {
  return await fetchDataByEndpoint("departments");
}

export const getServices = async () => {
  return await fetchDataByEndpoint("services");
}

export const getSearchableItems = async () => {
  let buildings = await getBuildings();
  let pois = await getPointOfInterests();
  let departments = await getDepartments();
  let services = await getServices();
  // remove unnecessary fields in buildings and add departments and services
  buildings = buildings.map(building => {
    return {
      id: building.id,
      name: building.name,
      building_code: building.building_code,
      location: building.location,
      civic_address: building.civic_address,
      campus: building.campus,
      departments: departments.filter(department => department.building === building.id).map(department => department.link_text),
      services: services.filter(service => service.building === building.id).map(service => service.link_text)
    };
  });
  // format departments
  return {
    buildings: buildings,
    pois: pois
  }
}