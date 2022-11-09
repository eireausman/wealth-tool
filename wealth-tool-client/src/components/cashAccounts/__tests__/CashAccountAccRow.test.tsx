import React from "react";
import { fireEvent, getByTestId, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import CashAccountAccRow from "../CashAccountAccRow";
import { dummyAccountData, selectedCurrency } from "../../../assets/testData";

import * as useGetCashAccountBalances from "../hooks/useGetCashAccountBalances";
import * as useUpdateNetCashAccTotal from "../hooks/useUpdateNetCashAccTotal";
import { useAssetCountContext } from "../../../modules/Contexts";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

(useGetCashAccountBalances.default as jest.Mock) = jest.fn();
(useUpdateNetCashAccTotal.default as jest.Mock) = jest.fn();
(useUpdateNetCashAccTotal.default as jest.Mock).mockReturnValue(100200300);

describe("Cash Account Row tests", () => {
  it("Account data displays", async () => {
    await act(async () => {
      render(
        <CashAccountAccRow
          data={dummyAccountData}
          settriggerRecalculations={() => {}}
          triggerRecalculations={1}
          selectedCurrency={selectedCurrency}
          setentryIDWasDeleted={() => {}}
          setthisItemIdBeingEdited={() => {}}
        />
      );
    });
    expect(screen.getByText("OWNERNAME")).toBeInTheDocument();
  });
  it("Edit Account Modal appears - mouse click", async () => {
    await act(async () => {
      render(
        <CashAccountAccRow
          data={dummyAccountData}
          settriggerRecalculations={() => {}}
          triggerRecalculations={1}
          selectedCurrency={selectedCurrency}
          setentryIDWasDeleted={() => {}}
          setthisItemIdBeingEdited={() => {}}
        />
      );
    });
    expect(screen.getByTestId("editThisAccountDiv")).toBeInTheDocument();
    expect(screen.queryByTestId("newAdditionModal")).not.toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByTestId("editThisAccountDiv"));
    });
    expect(screen.getByTestId("newAdditionModal")).toBeInTheDocument();
  });
  it("Edit Account Modal appears - enter key", async () => {
    await act(async () => {
      render(
        <CashAccountAccRow
          data={dummyAccountData}
          settriggerRecalculations={() => {}}
          triggerRecalculations={1}
          selectedCurrency={selectedCurrency}
          setentryIDWasDeleted={() => {}}
          setthisItemIdBeingEdited={() => {}}
        />
      );
    });
    expect(screen.getByTestId("editThisAccountDiv")).toBeInTheDocument();
    expect(screen.queryByTestId("newAdditionModal")).not.toBeInTheDocument();
    const screenLocation = screen.getByTestId("editThisAccountDiv");
    await act(async () => {
      fireEvent.keyUp(screenLocation, { key: "Enter" });
    });
    expect(screen.getByTestId("newAdditionModal")).toBeInTheDocument();
  });
  it("Modal closes with Escape Key", async () => {
    await act(async () => {
      render(
        <CashAccountAccRow
          data={dummyAccountData}
          settriggerRecalculations={() => {}}
          triggerRecalculations={1}
          selectedCurrency={selectedCurrency}
          setentryIDWasDeleted={() => {}}
          setthisItemIdBeingEdited={() => {}}
        />
      );
    });
    expect(screen.getByTestId("editThisAccountDiv")).toBeInTheDocument();
    expect(screen.queryByTestId("newAdditionModal")).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.keyUp(screen.getByTestId("editThisAccountDiv"), {
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
  });
  // it("Modal closes with mouse click", async () => {
  //   await act(async () => {
  //     render(
  //       <CashAccountAccRow
  //         data={dummyAccountData}
  //         settriggerRecalculations={() => {}}
  //         triggerRecalculations={1}
  //         selectedCurrency={selectedCurrency}
  //         setentryIDWasDeleted={() => {}}
  //         setthisItemIdBeingEdited={() => {}}
  //       />
  //     );
  //   });
  //   expect(screen.getByTestId("editThisAccountDiv")).toBeInTheDocument();
  //   expect(screen.queryByTestId("newAdditionModal")).not.toBeInTheDocument();

  //   await act(async () => {
  //     userEvent.click(screen.getByTestId("newAdditionModal"));
  //   });
  //   expect(screen.queryByTestId("newAdditionModal")).not.toBeInTheDocument();
  // });
});
