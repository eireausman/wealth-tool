import React, { useState, useEffect, Fragment, useContext } from "react";
import { CashAccountsProps } from "../../../types/typeInterfaces";
import "./CashAccounts.css";
import CardSpinner from "./CardSpinner";
import CashAccountAddAcc from "./CashAccountAddAcc";
import { cashAccountAPIData } from "../../../types/typeInterfaces";
import {
  getCashAccountData,
  getNetCashAccountTotal,
  getSingleCashAccountData,
} from "../modules/serverRequests";
import { AxiosResponse } from "axios";

import CashAccountAccRow from "./CashAccountAccRow";
import NoAssets from "./NoAssetsMessage";
import { FaPiggyBank } from "react-icons/fa";
import ButtonAddAsset from "./ButtonAddAsset";
import ViewCardHeaderRow from "./ViewCardHeaderRow";
import CashAccountAccRowUpdatingVals from "./CashAccountAccRowUpdatingVals";

const CashAccounts: React.FC<CashAccountsProps> = ({
  triggerRecalculations,
  settriggerRecalculations,
  selectedCurrency,
}) => {
  const sortArray = [
    { readableString: "A/c Name", dbField: "account_nickname" },
    { readableString: "Owner", dbField: "account_owner_name" },
    { readableString: "Balance", dbField: "account_balance" },
  ];

  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [showNoAccountsMessage, setshowNoAccountsMessage] = useState(false);
  const [cashAccountNetTotal, setcashAccountNetTotal] = useState<
    number | undefined
  >(0);
  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("account_nickname");

  const [cashAccAPIData, setcashAccAPIData] =
    useState<Array<cashAccountAPIData>>();

  const updatedAllAccountBalances = async (cashAccountID?: number) => {
    setshowNoAccountsMessage(false);
    setcashAccountNetTotal(undefined);
    if (cashAccountID !== undefined && cashAccAPIData !== undefined) {
      // we are dealing with a single cash account edit
      const cashAccAPIDataCopy = [...cashAccAPIData];
      for (let item in cashAccAPIDataCopy) {
        // update the record so the shimmer shows while it reloads
        if (cashAccAPIData[item].account_id === cashAccountID) {
          cashAccAPIData[item].reloading = "valReloading";

          setcashAccAPIData(cashAccAPIDataCopy);
          // the price will have been saved by the function called elseswhere, so let's reload this record and remove the holding shimmer
          const newPriceData = await getSingleCashAccountData(
            selectedCurrency.currency_code,
            cashAccountID
          );

          if (newPriceData) {
            if (newPriceData.data[0].account_id === cashAccountID) {
              cashAccAPIDataCopy[item] = newPriceData.data[0];
            }
            setcashAccAPIData(cashAccAPIDataCopy);
          }

          break;
        }
      }
    } else {
      if (cashAccAPIData !== undefined) {
        // we are dealing with a full refresh, triggered by a currency change for example
        const cashAccAPIDataCopy = [...cashAccAPIData];
        // set the records to relading so the shimmer shows
        cashAccAPIDataCopy.forEach((item) => {
          item.reloading = "valReloading";
        });
        setcashAccAPIData(cashAccAPIDataCopy);
      }
      // reload the data
      const cashAccServerDataRequest: AxiosResponse<any, any> | undefined =
        await getCashAccountData(
          selectedCurrency.currency_code,
          orderByThisColumn
        );

      if (
        cashAccServerDataRequest !== undefined &&
        cashAccServerDataRequest.status === 200 &&
        cashAccServerDataRequest.data !== undefined
      ) {
        setcashAccAPIData(cashAccServerDataRequest.data);
        setshowNoAccountsMessage(false);
      } else if (
        cashAccServerDataRequest !== undefined &&
        cashAccServerDataRequest.status === 204
      ) {
        setshowNoAccountsMessage(true);
      }
    }
    // update the net totals because we've updated a record / currency etc.
    const total = await getNetCashAccountTotal(selectedCurrency.currency_code);
    setcashAccountNetTotal(total);
  };

  //reload API data if currency changes:
  useEffect(() => {
    updatedAllAccountBalances();
  }, [selectedCurrency.currency_code, orderByThisColumn]);

  const showAddNewCashAccForm = () => {
    setshowAddNewForm(true);
  };

  const closeModal = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className === "newAdditionModal") {
      setshowAddNewForm(false);
    }
  };

  return (
    <section className="viewCard">
      {cashAccAPIData === undefined && showNoAccountsMessage === false && (
        <CardSpinner cardTitle="Cash Accounts" />
      )}
      {showNoAccountsMessage === true && (
        <Fragment>
          <NoAssets
            cardTitle="Cash Accounts"
            cardText="No accounts being tracked"
            assetType="cashAccount"
          />
          <ButtonAddAsset
            clickFunction={showAddNewCashAccForm}
            buttonTextContent="Add Account"
          />
        </Fragment>
      )}
      {cashAccAPIData !== undefined && showNoAccountsMessage === false && (
        <Fragment>
          <ViewCardHeaderRow
            rowIcon={<FaPiggyBank size={25} color={"white"} />}
            rowTitle="CASH ACCOUNTS"
            netTotal={cashAccountNetTotal}
            selectedCurrency={selectedCurrency}
            addNewFunction={showAddNewCashAccForm}
            sortArray={sortArray}
            orderByThisColumn={orderByThisColumn}
            setorderByThisColumn={setorderByThisColumn}
          />

          <section className="cashAccountsTable">
            <header className="cashAccountsTableHeader">
              <div className="table-header">A/c Name</div>
              <div className="table-header">Owner</div>
              <div className="table-header">Balance</div>
            </header>
            <section className="cashAccountsTableDataContainer scrollbarstyles">
              {cashAccAPIData?.map((data, index) => (
                <Fragment key={data.account_id}>
                  {data.reloading === "valReloading" ? (
                    <CashAccountAccRowUpdatingVals
                      key={data.account_id}
                      data={data}
                      updatedAllAccountBalances={updatedAllAccountBalances}
                      settriggerRecalculations={settriggerRecalculations}
                      triggerRecalculations={triggerRecalculations}
                      selectedCurrency={selectedCurrency}
                    />
                  ) : (
                    <CashAccountAccRow
                      key={data.account_id}
                      data={data}
                      updatedAllAccountBalances={updatedAllAccountBalances}
                      settriggerRecalculations={settriggerRecalculations}
                      triggerRecalculations={triggerRecalculations}
                      selectedCurrency={selectedCurrency}
                    />
                  )}
                </Fragment>
              ))}
            </section>
          </section>
        </Fragment>
      )}

      {showAddNewForm === true && (
        <div className="newAdditionModal" onClick={(e) => closeModal(e)}>
          <div className="newAdditionModalInner">
            {" "}
            <CashAccountAddAcc
              setshowAddNewForm={setshowAddNewForm}
              updatedAllAccountBalances={updatedAllAccountBalances}
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CashAccounts;
