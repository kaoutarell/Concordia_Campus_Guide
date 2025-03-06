import React from "react";
import { render } from "@testing-library/react-native";
import DirectionsList from "../components/navigation-screen-ui/sections/DirectionList";

describe("DirectionsList", () => {
  const mockSteps = [
    {
      distance: 150,
      duration: 120,
      instruction: "Walk 150 meters straight ahead",
      type: 1,
      coordinates: [
        [-73.579, 45.497],
        [-73.578, 45.498],
      ],
    },
    {
      distance: 1200,
      duration: 800,
      instruction: "Turn right and continue for 1.2 km",
      type: 2,
      coordinates: [
        [-73.578, 45.498],
        [-73.57, 45.498],
      ],
    },
    {
      distance: 400,
      duration: 300,
      instruction: "Turn left at the traffic light",
      type: 3,
      coordinates: [
        [-73.57, 45.498],
        [-73.57, 45.494],
      ],
    },
  ];

  it("renders correctly with steps", () => {
    const { getByText } = render(<DirectionsList steps={mockSteps} />);

    // Check if header is rendered
    expect(getByText("Directions")).toBeTruthy();

    // Check if directions are displayed with correct formatting
    expect(getByText("150.0 m")).toBeTruthy();
    expect(getByText("1.2 km")).toBeTruthy();
    expect(getByText("400.0 m")).toBeTruthy();

    // Check if instructions are displayed
    expect(getByText("Walk 150 meters straight ahead")).toBeTruthy();
    expect(getByText("Turn right and continue for 1.2 km")).toBeTruthy();
    expect(getByText("Turn left at the traffic light")).toBeTruthy();
  });

  it("renders empty list when no steps are provided", () => {
    const { getByText, queryByText } = render(<DirectionsList steps={null} />);

    // Header should still be rendered
    expect(getByText("Directions")).toBeTruthy();

    // Should not render any steps
    expect(queryByText("150.0 m")).toBeFalsy();
  });

  it("handles empty steps array", () => {
    const { getByText } = render(<DirectionsList steps={[]} />);

    // Header should still be rendered
    expect(getByText("Directions")).toBeTruthy();
  });
});
