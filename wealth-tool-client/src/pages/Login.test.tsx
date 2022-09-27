import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

describe("Empty form renders correctly", () => {
  it("Naviation container renders", () => {
    act(() => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
    });
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("detail")).toBeInTheDocument();
    expect(screen.getByTestId("addDueDate")).toBeInTheDocument();
  });
});
