import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import ButtonSort from "../ButtonSort";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

describe("viewCard Sort Button", () => {
  it("Sort button functionality", async () => {
    const clickMock = jest.fn();
    await act(async () => {
      render(
        <ButtonSort
          sortArray={[
            { readableString: "displayedSortString", dbField: "string" },
          ]}
          orderByThisColumn="this"
          setorderByThisColumn={() => {}}
        />
      );
    });
    expect(screen.getByRole("button", { name: /sort/i })).toBeInTheDocument();
    await act(async () => {
      fireEvent.mouseEnter(screen.getByRole("button", { name: /sort/i }));
    });
    expect(screen.getByText("displayedSortString")).toBeInTheDocument();
    await act(async () => {
      fireEvent.mouseLeave(screen.getByRole("button", { name: /sort/i }));
    });
    expect(screen.queryByText("displayedSortString")).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /sort/i }));
    });
    expect(screen.getByText("displayedSortString")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /sort/i }));
    });
    expect(screen.queryByText("displayedSortString")).not.toBeInTheDocument();
  });
});
