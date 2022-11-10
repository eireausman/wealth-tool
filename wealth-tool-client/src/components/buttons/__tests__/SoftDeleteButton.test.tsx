import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import SoftDeleteButton from "../SoftDeleteButton";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

describe("Soft Delete Button", () => {
  it("Sort button functionality", async () => {
    const props = { setshowSoftDelConfirm: jest.fn() };
    await act(async () => {
      render(<SoftDeleteButton {...props} />);
    });

    const softDeletebutton = screen.getByRole("button", { name: /delete/i });

    await act(async () => {
      fireEvent.click(softDeletebutton);
    });
    expect(props.setshowSoftDelConfirm).toHaveBeenCalledTimes(1);
  });
});
