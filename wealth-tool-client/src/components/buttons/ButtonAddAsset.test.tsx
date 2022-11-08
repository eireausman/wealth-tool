import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ButtonAddAsset from "./ButtonAddAsset";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

describe("Create Account page tests", () => {
  it("Renders with login here message", () => {
    act(() => {
      //   render(<ButtonAddAsset />);
    });
    // expect(screen.getByText("Login here")).toBeInTheDocument();
  });
});
