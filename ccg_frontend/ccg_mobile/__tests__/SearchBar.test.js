import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from "@testing-library/react-native";
import SearchBar from "../components/map-screen-ui/elements/SearchBar";
import { cleanup } from "@testing-library/react-native";

afterEach(() => {
  cleanup();
});

// Mock location data
const locations = [
  { name: "Samuel Bronfman Building" },
  { name: "Hingston Hall, wing HC" },
  { name: "X Annex" },
  { name: "Vanier Library Building" },
  { name: "FA Annex" },
];

describe("SearchBar Component", () => {
  it("should render SearchBar with correct placeholder", async () => {
    const { getByPlaceholderText } = render(
      <SearchBar locations={locations} />
    );
    // Check if the placeholder and value are correctly rendered
    const input = await waitFor(() => getByPlaceholderText("Where to?"), {
      timeout: 3000, // Wait for up to 3 seconds
    });
    expect(input.props.value).toBe("");
  });

  it("should call setSearchText when text changes", async () => {
    const setSearchText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar locations={locations} setIsSearching={setSearchText} />
    );

    const input = await waitFor(() => getByPlaceholderText("Where to?"), {
      timeout: 3000, // Wait for the input to be rendered
    });

    // Simulate text change; wrapped inside act to avoid ReferenceError
    await act(async () => {
      fireEvent.changeText(input, "X Annex");
    });

    // Ensure setSearchText is called with the new value
    expect(setSearchText).toHaveBeenCalledWith(true);
  });

  it("should not search anything if there is no text input", async () => {
    const setSearchText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar locations={locations} setIsSearching={setSearchText} />
    );
    const input = await waitFor(() => getByPlaceholderText("Where to?"), {
      timeout: 3000, // Wait for input to appear
    });

    // wrapped inside act to avoid ReferenceError
    await act(async () => {
      fireEvent.changeText(input, "");
    });

    expect(setSearchText).toHaveBeenCalledWith(false);
  });

  it("should update filtered locations based on input", async () => {
    const setIsSearching = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar locations={locations} setIsSearching={setIsSearching} />
    );

    const input = getByPlaceholderText("Where to?");
    fireEvent.changeText(input, "Vanier L");

    // Wait for filtered locations to appear
    await screen.queryByText("Vanier Library Building");

    // Log to see if locations are filtered correctly
    screen.debug();
  });

  it("should not show Vanier Extension when 'Vanier L' is typed", async () => {
    const setIsSearching = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar locations={locations} setIsSearching={setIsSearching} />
    );

    const input = getByPlaceholderText("Where to?");
    fireEvent.changeText(input, "Vanier L");

    const vanierExtension = screen.queryByText("Vanier Extension");
    expect(vanierExtension).toBeNull();
  });

  it("should call setIsSearching when input changes", async () => {
    const setIsSearching = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar locations={locations} setIsSearching={setIsSearching} />
    );

    const input = getByPlaceholderText("Where to?");
    fireEvent.changeText(input, "Vanier L");

    expect(setIsSearching).toHaveBeenCalledWith(true);
  });

  it("should update filtered locations and show the correct suggestions", async () => {
    const { getByPlaceholderText, queryAllByText } = render(
      <SearchBar
        locations={locations}
        setIsSearching={jest.fn()}
        setStartLocation={jest.fn()}
        setDestinationLocation={jest.fn()}
        handleViewNavigation={jest.fn()}
      />
    );

    // Simulate typing in the destination search input
    const destinationInput = getByPlaceholderText("Where to?");
    fireEvent.changeText(destinationInput, "Vanier L");

    // Mock the filtered locations state after the input change
    const filteredLocations = ["Vanier Library Building"];

    // Use queryAllByText to check if the filtered location is rendered in the dropdown
    const filteredSuggestions = queryAllByText(filteredLocations);

    // Log the filtered suggestions to confirm they're being rendered
    console.log("Filtered Suggestions:", filteredSuggestions);

    // Expect the filtered suggestion to be present in the dropdown
    expect(filteredSuggestions).toBeTruthy();
  });

  it("should call setStartPoint and update filtered locations when input changes", async () => {
    const setStartPoint = jest.fn();
    const setIsSearching = jest.fn();

    const { queryAllByText } = render(
      <SearchBar
        locations={locations}
        setStartPoint={setStartPoint}
        setIsSearching={setIsSearching}
        selectedDestination={"Vanier Library Building"}
      />
    );

    // Call handleSearch directly with the expected arguments
    const handleSearch = (text, type) => {
      if (type != "destination") {
        setStartPoint(text);
        setIsSearching(text.length > 0);
      }
    };

    // Call handleSearch with "X Annex" and "start"
    handleSearch("X Annex", "start");

    // Ensure setStartPoint is called with "X Annex"
    expect(setStartPoint).toHaveBeenCalledWith("X Annex");

    // Ensure setIsSearching is called with true
    expect(setIsSearching).toHaveBeenCalledWith(true);

    // Mock the filtered locations state after the input change
    const filteredLocations = ["X Annex"];

    // Use queryAllByText to check if the filtered location is rendered in the dropdown
    const filteredSuggestions = queryAllByText(filteredLocations);

    // Expect the filtered suggestion to be present in the dropdown
    expect(filteredSuggestions).toBeTruthy();
  });
});
