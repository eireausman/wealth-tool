import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import ButtonAddAsset from "./ButtonAddAsset";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

describe("Create Account page tests", () => {
  it("Renders with login here message", async () => {
    const clickMock = jest.fn();
    await act(async () => {
      render(
        <ButtonAddAsset
          clickFunction={clickMock}
          buttonTextContent="someText"
        />
      );
    });
    expect(screen.getByText("someText")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByText("someText"));
    });
    expect(clickMock).toHaveBeenCalledTimes(1);
  });
});
