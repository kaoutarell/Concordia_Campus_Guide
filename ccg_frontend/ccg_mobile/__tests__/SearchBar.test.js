import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SearchBar from "../components/SearchBar";

// Mock location data
const locations = [
  { name: "New York" },
  { name: "Los Angeles" },
  { name: "San Francisco" },
  { name: "Chicago" },
  { name: "Miami" },
];

describe("SearchBar Component", () => {
  it("should render SearchBar with correct initial searchText", async () => {
    const { getByPlaceholderText } = render(
      <SearchBar locations={locations} />
    );
    // Check if the placeholder and value are correctly rendered
    const input = await waitFor(() => getByPlaceholderText("Where to ?"));
    expect(input.props.value).toBe("New York");
  });

  it("should call setSearchText when text changes", async () => {
    const setSearchText = jest.fn();
    const { getByPlaceholderText } = render(<SearchBar />);

    const input = await waitFor(() => getByPlaceholderText("Where to ?"));

    // Simulate text change
    fireEvent.changeText(input, "Los Angeles");

    // Ensure setSearchText is called with the new value
    expect(setSearchText).toHaveBeenCalledWith("Los Angeles");
  });
});
