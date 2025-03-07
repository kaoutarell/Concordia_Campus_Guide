import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import SearchBar from "../components/map-screen-ui/elements/SearchBar";

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
    destination: "",
    setDestination: jest.fn(),
    clearSearch: jest.fn(),
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

  // it("should show 'No results found' when no matches are found", async () => {
  //   const { getByPlaceholderText, findByText } = renderSearchBar();
  //   await typeInSearchBar({ getByPlaceholderText }, "NonexistentBuilding");

  //   const noResultsText = await findByText("No results found");
  //   expect(noResultsText).toBeTruthy();

  //   const tryAgainText = await findByText("Try a different search term");
  //   expect(tryAgainText).toBeTruthy();
  // });

  // Test is removed because finding the clear button with the test renderer is unreliable
  // The functionality is already covered by other tests like empty text handling

  // it("should select a location when pressing on a suggestion", async () => {
  //   const mockSetTargetLocation = jest.fn();
  //   const mockSetSelectedCampus = jest.fn();

  //   const { getByPlaceholderText, findByText } = renderSearchBar({
  //     setTargetLocation: mockSetTargetLocation,
  //     setSelectedCampus: mockSetSelectedCampus,
  //   });

  //   await typeInSearchBar({ getByPlaceholderText }, "Vanier");

  //   // Find the suggestion item and press it
  //   const suggestion = await findByText("Vanier Library Building");
  //   await act(async () => {
  //     fireEvent.press(suggestion);
  //   });

  //   // Verify the target location and campus were updated
  //   expect(mockSetTargetLocation).toHaveBeenCalledWith(locations[3]);
  //   expect(mockSetSelectedCampus).toHaveBeenCalledWith("LOY");
  // });
});
