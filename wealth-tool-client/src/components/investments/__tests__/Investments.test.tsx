import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import Investments from "../Investments";
import {
  selectedCurrency,
  dummyInvestmentData,
} from "../../../assets/testData";
import { useAssetCountContext } from "../../../modules/Contexts";
import * as useRefreshInvestData from "../hooks/useRefreshInvestData";
import * as useUpdateNetInvestTotal from "../hooks/useUpdateNetInvestTotal";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

describe("Invesments ViewCard", () => {
  (useUpdateNetInvestTotal.default as jest.Mock) = jest.fn();
  (useUpdateNetInvestTotal.default as jest.Mock).mockReturnValue(100200300);
  const props = {
    settriggerRecalculations: jest.fn(),
    triggerRecalculations: 1,
    selectedCurrency,
  };
  it("Loading state renders - pending data retrieval (spinner)", async () => {
    (useRefreshInvestData.default as jest.Mock) = jest.fn();

    await act(async () => {
      (useRefreshInvestData.default as jest.Mock).mockReturnValue([
        dummyInvestmentData,
      ]);
      render(
        <useAssetCountContext.Provider value={{ investments: -1 }}>
          <Investments {...props} />
        </useAssetCountContext.Provider>
      );
    });
    // Investments is the loading spinner text during account retrieval
    expect(screen.getByText("Investments")).toBeInTheDocument();
    // INVESTMENTS is the viewCard header if accounts retrieved
    expect(screen.queryByText("INVESTMENTS")).not.toBeInTheDocument();
  });
  it("Loading state renders - no investments to show", async () => {
    (useRefreshInvestData.default as jest.Mock).mockReturnValue([]);
    await act(async () => {
      render(
        <useAssetCountContext.Provider value={{ investments: 0 }}>
          <Investments {...props} />
        </useAssetCountContext.Provider>
      );
    });
    expect(
      screen.getByText("No investments being tracked")
    ).toBeInTheDocument();
  });
  it("Investments render as expected", async () => {
    (useRefreshInvestData.default as jest.Mock).mockReturnValue(
      dummyInvestmentData
    );
    await act(async () => {
      render(
        <useAssetCountContext.Provider value={{ investments: 1 }}>
          <Investments {...props} />
        </useAssetCountContext.Provider>
      );
    });
    expect(
      screen.getByText("AMERICAN ELECTRIC POWER COMPANY")
    ).toBeInTheDocument();
    expect(
      screen.getByText("G3 EXPLORATION LIMITED ORD USD0")
    ).toBeInTheDocument();
  });
  it("New account modal button opens modal", async () => {
    (useRefreshInvestData.default as jest.Mock).mockReturnValue(
      dummyInvestmentData
    );
    await act(async () => {
      render(
        <useAssetCountContext.Provider value={{ investments: 1 }}>
          <Investments {...props} />
        </useAssetCountContext.Provider>
      );
    });
    expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: /Add/i }));
    });

    expect(screen.getByTestId("newAdditionModal")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByTestId("newAdditionModal"));
    });
    expect(screen.queryByTestId("newAdditionModal")).not.toBeInTheDocument();
  });
});
