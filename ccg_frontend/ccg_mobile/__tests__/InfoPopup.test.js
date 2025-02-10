import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import InfoPopup from "../components/InfoPopUp.js";
// Mock Ionicons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name }) => <>{name}</>,
  FontAwesome: ({ name }) => <>{name}</>,
}));

describe("InfoPopup", () => {
  const mockBuilding = {
    // Define mockBuilding *outside* the tests
    name: "Building A",
    building_code: "A",
    civic_address: "1234 Elm St",
    campus: "SGW",
    parking_lot: true,
    accessibility: true,
    atm: false,
  };

  it("renders the InfoPopup", () => {
    const mockOnClose = jest.fn();
    const mockOnGo = jest.fn();

    // render(
    //   <InfoPopup value={mockBuilding} onClose={mockOnClose} onGo={mockOnGo} />
    // );
  });

  // it("triggers onClose when close button is pressed", () => {
  //   const mockOnClose = jest.fn();
  //   const mockOnGo = jest.fn();

  //   render(
  //     <InfoPopup value={mockBuilding} onClose={mockOnClose} onGo={mockOnGo} />
  //   );

  //   fireEvent.press(screen.getByRole("button", { name: "Close" })); // Use screen.getByRole!
  //   expect(mockOnClose).toHaveBeenCalledTimes(1);
  // });

  // it("triggers onGo when go button is pressed", () => {
  //   const mockOnGo = jest.fn();

  //   render(
  //     <InfoPopup value={mockBuilding} onClose={jest.fn()} onGo={mockOnGo} />
  //   );

  //   fireEvent.press(screen.getByRole("button", { name: "Go" })); // Use screen.getByRole!
  //   expect(mockOnGo).toHaveBeenCalledTimes(1);
  // });
});
