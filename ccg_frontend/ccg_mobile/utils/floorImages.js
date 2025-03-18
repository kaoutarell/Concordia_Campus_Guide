const floorImages = {
  H8: require("../assets/floors/Hall-8.png"),
  H9: require("../assets/floors/Hall-9.png"),
};

export const getFloorImage = floor => {
  return floorImages[floor] || floorImages.H8;
};

export const getFloorImages = () => floorImages;
