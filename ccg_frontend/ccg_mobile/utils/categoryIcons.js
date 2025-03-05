// React Native doesn't allow us to use dynamic paths with require(), so we must use this logic.
const categoryIcons = {
  atm: require("../assets/poi_icons/atm.png"),
  bank: require("../assets/poi_icons/bank.png"),
  bar: require("../assets/poi_icons/bar.png"),
  bicycle_parking: require("../assets/poi_icons/bicycle_parking.png"),
  bicycle_rental: require("../assets/poi_icons/bicycle_rental.png"),
  bureau_de_change: require("../assets/poi_icons/bureau_de_change.png"),
  cafe: require("../assets/poi_icons/cafe.png"),
  car_rental: require("../assets/poi_icons/car_rental.png"),
  charging_station: require("../assets/poi_icons/charging_station.png"),
  childcare: require("../assets/poi_icons/childcare.png"),
  cinema: require("../assets/poi_icons/cinema.png"),
  clinic: require("../assets/poi_icons/clinic.png"),
  community_centre: require("../assets/poi_icons/community_centre.png"),
  convenience: require("../assets/poi_icons/convenience.png"),
  dentist: require("../assets/poi_icons/dentist.png"),
  doctors: require("../assets/poi_icons/doctors.png"),
  dojo: require("../assets/poi_icons/dojo.png"),
  driving_school: require("../assets/poi_icons/driving_school.png"),
  events_venue: require("../assets/poi_icons/events_venue.png"),
  fast_food: require("../assets/poi_icons/fast_food.png"),
  fuel: require("../assets/poi_icons/fuel.png"),
  ice_cream: require("../assets/poi_icons/ice_cream.png"),
  library: require("../assets/poi_icons/library.png"),
  nightclub: require("../assets/poi_icons/nightclub.png"),
  other: require("../assets/poi_icons/other.png"),
  parking_entrance: require("../assets/poi_icons/parking_entrance.png"),
  pharmacy: require("../assets/poi_icons/pharmacy.png"),
  police: require("../assets/poi_icons/police.png"),
  post_box: require("../assets/poi_icons/post_box.png"),
  post_office: require("../assets/poi_icons/post_office.png"),
  pub: require("../assets/poi_icons/pub.png"),
  restaurant: require("../assets/poi_icons/restaurant.png"),
  school: require("../assets/poi_icons/school.png"),
  social_facility: require("../assets/poi_icons/social_facility.png"),
  theatre: require("../assets/poi_icons/theatre.png"),
  townhall: require("../assets/poi_icons/townhall.png"),
  university: require("../assets/poi_icons/university.png"),
  waste_basket: require("../assets/poi_icons/waste_basket.png"),
};

export const getCategoryIcon = (category) => {
  return categoryIcons[category] || categoryIcons.university;
};

export const getCategoryIcons = () => categoryIcons;
