const floorImages = {
  H8: require("../assets/floors/Hall-8.png"),
  H9: require("../assets/floors/Hall-9.png"),
  H2: require("../assets/floors/H2.png"),
  H1: require("../assets/floors/H1.png"),
  MB1: require("../assets/floors/MB-1.png"),
  CC1: require("../assets/floors/CC1.png"),
};

export const getFloorImage = floor => {
  return floorImages[floor] || floorImages.H8;
};

export const getFloorImages = () => floorImages;
