import React from "react";
import { render, fireEvent, waitFor, screen, act } from "@testing-library/react-native";
import SearchBar from "../components/map-screen-ui/elements/SearchBar";
import { cleanup } from "@testing-library/react-native";

afterEach(() => {
  cleanup();
});

// Mock location data with campus property
const locations = [
  { name: "Samuel Bronfman Building", campus: "SGW" },
  { name: "Hingston Hall, wing HC", campus: "LOY" },
  { name: "X Annex", campus: "SGW" },
  { name: "Vanier Library Building", campus: "LOY" },
  { name: "FA Annex", campus: "SGW" },
];

describe("SearchBar Component", () => {
  // Default props for all tests
  const defaultProps = {
    locations,
    setTargetLocation: jest.fn(),
    setSelectedCampus: jest.fn(),
  };

  // Helper function to render SearchBar with default props
  const renderSearchBar = (props = {}) => {
    return render(<SearchBar {...defaultProps} {...props} />);
  };

  // Helper function to get input and trigger text change
  const typeInSearchBar = async (renderResult, text, shouldFocus = true) => {
    const input = renderResult.getByPlaceholderText("Where to?");

    if (shouldFocus) {
      fireEvent(input, "focus");
    }

    await act(async () => {
      fireEvent.changeText(input, text);
    });

    return input;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render SearchBar with correct placeholder", async () => {
    const { getByPlaceholderText } = renderSearchBar();

    // Check if the placeholder and value are correctly rendered
    const input = await waitFor(() => getByPlaceholderText("Where to?"), {
      timeout: 3000, // Wait for up to 3 seconds
    });
    expect(input.props.value).toBe("");
  });

  it("should update input value when text changes", async () => {
    const { getByPlaceholderText } = renderSearchBar();
    const input = await typeInSearchBar({ getByPlaceholderText }, "X Annex");

    // Verify input value updates correctly
    expect(input.props.value).toBe("X Annex");
  });

  it("should clear input when empty text is entered", async () => {
    const { getByPlaceholderText } = renderSearchBar();

    // First type something
    const input = await typeInSearchBar({ getByPlaceholderText }, "X Annex");
    expect(input.props.value).toBe("X Annex");

    // Then clear it
    await act(async () => {
      fireEvent.changeText(input, "");
    });

    // Ensure input is cleared
    expect(input.props.value).toBe("");
  });

  it("should not show Vanier Extension when 'Vanier L' is typed", async () => {
    const { getByPlaceholderText } = renderSearchBar();
    await typeInSearchBar({ getByPlaceholderText }, "Vanier L");

    // Verify non-existent location is not shown
    const vanierExtension = screen.queryByText("Vanier Extension");
    expect(vanierExtension).toBeNull();
  });

  it("should update input correctly when typing 'Vanier L'", async () => {
    const renderResult = renderSearchBar();
    const input = await typeInSearchBar(renderResult, "Vanier L");

    // Verify input text is updated
    expect(input.props.value).toBe("Vanier L");
  });

  // Test variations with different search terms
  const searchTerms = ["Vanier L", "X Annex", "Samuel B"];
  searchTerms.forEach(term => {
    it(`should correctly update input value when searching for "${term}"`, async () => {
      const renderResult = renderSearchBar();
      const input = await typeInSearchBar(renderResult, term);

      // Verify input value matches search term
      expect(input.props.value).toBe(term);
    });
  });
});
