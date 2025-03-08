import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import SearchBar from "../components/map-screen-ui/elements/SearchBar";
import { Keyboard } from "react-native";

const mockNavigate = jest.fn();

// Mock Keyboard
jest.mock("react-native/Libraries/Components/Keyboard/Keyboard", () => ({
  dismiss: jest.fn(),
}));

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

  it("should handle the onGoBack callback correctly", async () => {
    const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />);
    const input = getByPlaceholderText("Where to?");

    await act(async () => {
      fireEvent(input, "focus");
    });

    // Extract the onGoBack callback from the navigation call
    const onGoBack = mockNavigate.mock.calls[0][1].onGoBack;

    // Simulate selecting a destination
    const selectedDestination = {
      name: "Hall Building",
      campus: "SGW",
      id: "school-3",
    };

    // Call the callback
    onGoBack(selectedDestination);

    // Verify that the state was updated correctly
    expect(mockSetTargetLocation).toHaveBeenCalledWith(selectedDestination);
    expect(mockSetSelectedCampus).toHaveBeenCalledWith("SGW");
    expect(Keyboard.dismiss).toHaveBeenCalled();
  });

  it("should clear search when the clear button is clicked", async () => {
    // Render the component with an initial destination value set
    const { getByPlaceholderText, getByTestId, rerender } = render(<SearchBar {...defaultProps} />);

    // Set initial state by simulating a selection
    const input = getByPlaceholderText("Where to?");

    // Focus to trigger navigation
    await act(async () => {
      fireEvent(input, "focus");
    });

    // Extract and call the onGoBack callback to set destination state
    const onGoBack = mockNavigate.mock.calls[0][1].onGoBack;
    const selectedDestination = { name: "Hall Building", campus: "SGW", id: "school-3" };

    // Call the callback to set internal state
    act(() => {
      onGoBack(selectedDestination);
    });

    // Rerender the component to reflect state changes
    rerender(<SearchBar {...defaultProps} />);

    // Now the clear button should be visible
    const clearButton = getByTestId("clear-search-button");

    // Click the clear button
    act(() => {
      fireEvent.press(clearButton);
    });

    // Verify that the right actions were performed
    expect(mockSetTargetLocation).toHaveBeenCalledWith({});
    expect(mockSetSelectedCampus).toHaveBeenCalledWith("SGW");
    expect(Keyboard.dismiss).toHaveBeenCalled();
  });
});
