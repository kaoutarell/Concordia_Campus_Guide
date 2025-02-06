import React from "react";
import { render } from "@testing-library/react-native";
import App from "./App";

test("App renders without crashing", () => {
  render(<App />);
});
