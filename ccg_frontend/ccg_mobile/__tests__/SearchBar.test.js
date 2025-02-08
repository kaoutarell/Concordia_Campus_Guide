import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SearchBar from "../components/SearchBar";

describe("SearchBar Component", () => {
  it("should render SearchBar with correct initial searchText", () => {
    const setSearchText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar searchText="New York" setSearchText={setSearchText} />
    );

    // Check if the placeholder and value are correctly rendered
    const input = getByPlaceholderText("Where to ?");
    expect(input.props.value).toBe("New York");
  });

  it("should call setSearchText when text changes", () => {
    const setSearchText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar searchText="" setSearchText={setSearchText} />
    );

    const input = getByPlaceholderText("Where to ?");

    // Simulate text change
    fireEvent.changeText(input, "Los Angeles");

    // Ensure setSearchText is called with the new value
    expect(setSearchText).toHaveBeenCalledWith("Los Angeles");
  });
});
