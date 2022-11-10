import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import CashAccounts from "../CashAccounts";

import * as useGetCashAccountBalances from "../hooks/useGetCashAccountBalances";
import * as useUpdateNetCashAccTotal from "../hooks/useUpdateNetCashAccTotal";
import { useAssetCountContext } from "../../../modules/Contexts";
import { dummyAccountData, selectedCurrency } from "../../../assets/testData";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

(useGetCashAccountBalances.default as jest.Mock) = jest.fn();
(useUpdateNetCashAccTotal.default as jest.Mock) = jest.fn();
(useUpdateNetCashAccTotal.default as jest.Mock).mockReturnValue(100200300);

describe("Cash Accounts ViewCard Tests", () => {
  it("Loading state renders - pending data retrieval (spinner)", async () => {
    await act(async () => {
      render(
        <useAssetCountContext.Provider value={{ cashAccounts: -1 }}>
          <CashAccounts
            settriggerRecalculations={() => {}}
            triggerRecalculations={1}
            selectedCurrency={selectedCurrency}
          />
        </useAssetCountContext.Provider>
      );
    });
    // Cash Accounts is the loading spinner text during account retrieval
    expect(screen.getByText("Cash Accounts")).toBeInTheDocument();
    // CASH ACCOUNTS is the viewCard header if accounts retrieved
    expect(screen.queryByText("CASH ACCOUNTS")).not.toBeInTheDocument();
    expect(screen.queryByText("CASH ACCOUNTS")).not.toBeInTheDocument();
  });
  it("Loading state renders - no accounts to show", async () => {
    (useGetCashAccountBalances.default as jest.Mock).mockReturnValue([]);
    await act(async () => {
      render(
        <useAssetCountContext.Provider value={{ cashAccounts: 0 }}>
          <CashAccounts
            settriggerRecalculations={() => {}}
            triggerRecalculations={1}
            selectedCurrency={selectedCurrency}
          />
        </useAssetCountContext.Provider>
      );
    });
    expect(screen.getByText("No accounts being tracked")).toBeInTheDocument();
  });
  it("Accounts render as expected", async () => {
    (useGetCashAccountBalances.default as jest.Mock).mockReturnValue([
      dummyAccountData,
    ]);
    await act(async () => {
      render(
        <useAssetCountContext.Provider value={{ cashAccounts: 1 }}>
          <CashAccounts
            settriggerRecalculations={() => {}}
            triggerRecalculations={1}
            selectedCurrency={selectedCurrency}
          />
        </useAssetCountContext.Provider>
      );
    });
    expect(screen.getByText("OWNERNAME")).toBeInTheDocument();
  });
  it("New account modal button opens modal", async () => {
    (useGetCashAccountBalances.default as jest.Mock).mockReturnValue([
      dummyAccountData,
    ]);
    await act(async () => {
      render(
        <useAssetCountContext.Provider value={{ cashAccounts: 1 }}>
          <CashAccounts
            settriggerRecalculations={() => {}}
            triggerRecalculations={1}
            selectedCurrency={selectedCurrency}
          />
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
