import { getFloorImage, getFloorImages } from "../utils/floorImages";

describe("Floor Images", () => {
  it("should get a valid floor image for known floor", () => {
    const image = getFloorImage("H8");
    expect(image).not.toBeNull();
  });

  it("should get a valid floor image for unknown floor, defaulting to H8", () => {
    const image = getFloorImage("UnknownFloor");
    const h8Image = getFloorImage("H8");
    expect(image).toBe(h8Image);
  });

  it("should get all floor images", () => {
    const images = getFloorImages();
    expect(Object.keys(images)).toEqual(["H8", "H9", "H2", "H1", "MB1", "CC1"]);
  });
});
