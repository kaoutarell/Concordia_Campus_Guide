import React from "react";
import { render } from "@testing-library/react-native";
import FloorChangeButton from "../components/indoor-navigation-ui/elements/FloorChangeButton";

describe("IndoorMap Component", () => {
  it("displays prev button", () => {
    const { getByTestId } = render(<FloorChangeButton />);
    expect(getByTestId("prev-button")).toBeTruthy();
  });

  it("displays next button", () => {
    const { getByTestId } = render(<FloorChangeButton />);
    expect(getByTestId("next-button")).toBeTruthy();
  });
});
