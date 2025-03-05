import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import SearchBar from "../components/map-screen-ui/elements/SearchBar";
import { useNavigation } from "@react-navigation/native";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("SearchBar Component", () => {
  const mockSetTargetLocation = jest.fn();
  const mockSetSelectedCampus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    pointsOfInterest: [
      { id: "poi-1", name: "Library", campus: "SGW" },
      { id: "poi-2", name: "Cafeteria", campus: "LOY" },
    ],
    allLocations: [
      { id: "school-1", name: "Samuel Bronfman Building", campus: "SGW" },
      { id: "school-2", name: "Hingston Hall, wing HC", campus: "LOY" },
    ],
    setTargetLocation: mockSetTargetLocation,
    setSelectedCampus: mockSetSelectedCampus,
  };

  it("should render SearchBar with correct placeholder", () => {
    const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />);
    const input = getByPlaceholderText("Where to?");
    expect(input).toBeTruthy();
  });

  it("should navigate to 'Search' screen when tapped", async () => {
    const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />);
    const input = getByPlaceholderText("Where to?");

    await act(async () => {
      fireEvent(input, "focus");
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        "Search",
        expect.objectContaining({
          searchableItems: expect.any(Array),
          type: "destination",
          onGoBack: expect.any(Function),
        })
      );
    });
  });
});
