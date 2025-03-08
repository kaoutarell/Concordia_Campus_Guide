import React from "react";
import { render } from "@testing-library/react-native";
import NavigationDirection from "../components/navigation-screen-ui/sections/NavigationDirection";

describe("NavigationDirection", () => {
  it("renders correctly with straight direction", () => {
    const props = {
      distance: 150,
      instruction: "Continue straight ahead",
    };

    const { getByText } = render(<NavigationDirection {...props} />);

    // Check if the distance and instruction are rendered correctly
    expect(getByText("In 150.0 meters, Continue straight ahead!")).toBeTruthy();

    // Check if the straight arrow icon is rendered
    expect(getByText("↑")).toBeTruthy();
  });

  it("renders correctly with left turn direction", () => {
    const props = {
      distance: 200,
      instruction: "Turn left at the intersection",
    };

    const { getByText } = render(<NavigationDirection {...props} />);

    // Check if the distance and instruction are rendered correctly
    expect(getByText("In 200.0 meters, Turn left at the intersection!")).toBeTruthy();

    // Check if the left arrow icon is rendered
    expect(getByText("←")).toBeTruthy();
  });

  it("renders correctly with right turn direction", () => {
    const props = {
      distance: 300,
      instruction: "Turn right onto Sherbrooke St",
    };

    const { getByText } = render(<NavigationDirection {...props} />);

    // Check if the distance and instruction are rendered correctly
    expect(getByText("In 300.0 meters, Turn right onto Sherbrooke St!")).toBeTruthy();

    // Check if the right arrow icon is rendered
    expect(getByText("→")).toBeTruthy();
  });

  it("renders correctly with keep left direction", () => {
    const props = {
      distance: 250,
      instruction: "Keep left to stay on the path",
    };

    const { getByText } = render(<NavigationDirection {...props} />);

    // Check if the distance and instruction are rendered correctly
    expect(getByText("In 250.0 meters, Keep left to stay on the path!")).toBeTruthy();

    // Check if the diagonal left arrow icon is rendered
    expect(getByText("↖")).toBeTruthy();
  });

  it("renders correctly with keep right direction", () => {
    const props = {
      distance: 175,
      instruction: "Keep right to merge onto the main road",
    };

    const { getByText } = render(<NavigationDirection {...props} />);

    // Check if the distance and instruction are rendered correctly
    expect(getByText("In 175.0 meters, Keep right to merge onto the main road!")).toBeTruthy();

    // Check if the diagonal right arrow icon is rendered
    expect(getByText("↗")).toBeTruthy();
  });

  it("defaults to straight arrow for unknown instructions", () => {
    const props = {
      distance: 100,
      instruction: "Your destination is on the left",
    };

    const { getByText } = render(<NavigationDirection {...props} />);

    // Check if the distance and instruction are rendered correctly
    expect(getByText("In 100.0 meters, Your destination is on the left!")).toBeTruthy();

    // For this instruction it actually matches 'left' and returns a left arrow
    expect(getByText("←")).toBeTruthy();
  });
  
  it("uses default straight arrow when no direction keywords are present", () => {
    const props = {
      distance: 120,
      instruction: "You have arrived at your destination",
    };

    const { getByText } = render(<NavigationDirection {...props} />);

    // Check if the distance and instruction are rendered correctly
    expect(getByText("In 120.0 meters, You have arrived at your destination!")).toBeTruthy();

    // Should use the default straight arrow when no direction keywords match
    expect(getByText("↑")).toBeTruthy();
  });
});
