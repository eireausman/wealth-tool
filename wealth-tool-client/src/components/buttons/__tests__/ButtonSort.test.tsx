import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import ButtonAddAsset from "../ButtonAddAsset";
import ButtonSort from "../ButtonSort";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

describe("Sort Button - viewCard - test", () => {
  it("Renders with login here message", async () => {
    const clickMock = jest.fn();
    await act(async () => {
      render(
        <ButtonSort
          sortArray={[{ readableString: "string", dbField: "string" }]}
          orderByThisColumn="this"
          setorderByThisColumn={() => {}}
        />
      );
    });
    // expect(screen.getByText("someText")).toBeInTheDocument();
    // await act(async () => {
    //   userEvent.click(screen.getByRole("button", { name: /sort/i }));
    // });
    // expect(clickMock).toHaveBeenCalledTimes(1);
  });
});
