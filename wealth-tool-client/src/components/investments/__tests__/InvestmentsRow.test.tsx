import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import InvestmentRow from "../InvestmentRow";
import {
  selectedCurrency,
  dummySingleInvestmentData,
} from "../../../assets/testData";
import { useAssetCountContext } from "../../../modules/Contexts";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

describe("InvesmentsRow tests", () => {
  const props = {
    data: dummySingleInvestmentData,
    selectedCurrency,
    settriggerRecalculations: jest.fn(),
    triggerRecalculations: 1,
    setentryIDWasDeleted: jest.fn(),
    setthisItemIdBeingEdited: jest.fn(),
  };
  it("Loading state renders - pending data retrieval (spinner)", async () => {
    await act(async () => {
      render(<InvestmentRow {...props} />);
    });
    const rowClickArea = screen.getByRole("button", {
      name: /AMERICAN ELECTRIC POWER COMPANY/i,
    });
    expect(rowClickArea).toBeInTheDocument();
    await act(async () => {
      userEvent.click(rowClickArea);
    });

    expect(screen.getByTestId("newAdditionModal")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Save/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Cancel/i,
      })
    ).toBeInTheDocument();
  });
  it("Modal opens / closes", async () => {
    await act(async () => {
      render(<InvestmentRow {...props} />);
    });
    const rowClickArea = screen.getByRole("button", {
      name: /AMERICAN ELECTRIC POWER COMPANY/i,
    });
    expect(rowClickArea).toBeInTheDocument();
    expect(screen.queryByTestId("newAdditionModal")).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.keyUp(rowClickArea, {
        key: "Enter",
      });
    });
    expect(screen.getByTestId("newAdditionModal")).toBeInTheDocument();
    await act(async () => {
      fireEvent.keyUp(screen.getByTestId("newAdditionModal"), {
        key: "Escape",
      });
    });
    expect(screen.queryByTestId("newAdditionModal")).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.keyUp(rowClickArea, {
        key: "Enter",
      });
    });
    expect(screen.getByTestId("newAdditionModal")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByTestId("newAdditionModal"));
    });
    expect(screen.queryByTestId("newAdditionModal")).not.toBeInTheDocument();
  });

  it("Add new modal functionality", async () => {
    await act(async () => {
      render(<InvestmentRow {...props} />);
    });
    const rowClickArea = screen.getByRole("button", {
      name: /AMERICAN ELECTRIC POWER COMPANY/i,
    });
    expect(rowClickArea).toBeInTheDocument();
    await act(async () => {
      userEvent.click(rowClickArea);
    });

    expect(screen.getByTestId("newAdditionModal")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Save/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Cancel/i,
      })
    ).toBeInTheDocument();
  });
  it("Edit Icon appears on hover", async () => {
    await act(async () => {
      render(<InvestmentRow {...props} />);
    });
    const rowClickArea = screen.getByRole("button", {
      name: /AMERICAN ELECTRIC POWER COMPANY/i,
    });
    await act(async () => {
      fireEvent.mouseEnter(rowClickArea);
    });
    expect(screen.getByTestId("editValueIcon")).toBeVisible();
    await act(async () => {
      fireEvent.mouseLeave(rowClickArea);
    });
    expect(screen.queryByTestId("editValueIcon")).not.toBeVisible();
  });
});
