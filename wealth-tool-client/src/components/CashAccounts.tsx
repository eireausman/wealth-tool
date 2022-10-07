import React, { useState, useEffect, Fragment, useContext } from "react";
import { CashAccountsProps } from "../../../types/typeInterfaces";
import "./CashAccounts.css";
import CardSpinner from "./CardSpinner";
import CashAccountAddAcc from "./CashAccountAddAcc";
import { cashAccountAPIData } from "../../../types/typeInterfaces";
import {
  getCashAccountData,
  getNetCashAccountTotal,
} from "../modules/serverRequests";
import { AxiosResponse } from "axios";

import CashAccountAccRow from "./CashAccountAccRow";
import NoAssets from "./NoAssetsMessage";
import { FaPiggyBank } from "react-icons/fa";
import ButtonAddAsset from "./ButtonAddAsset";
import ViewCardHeaderRow from "./ViewCardHeaderRow";

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

  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [showNoAccountsMessage, setshowNoAccountsMessage] = useState(false);
  const [cashAccountNetTotal, setcashAccountNetTotal] = useState<number>(0);
  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("account_nickname");

  const [cashAccAPIData, setcashAccAPIData] =
    useState<Array<cashAccountAPIData>>();

  const updatedAllAccountBalances = async () => {
    setShowSpinner(true);
    setshowNoAccountsMessage(false);
    setcashAccAPIData(undefined);
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
      setShowSpinner(false);
      setcashAccAPIData(cashAccServerDataRequest.data);
      setshowNoAccountsMessage(false);
    } else if (
      cashAccServerDataRequest !== undefined &&
      cashAccServerDataRequest.status === 204
    ) {
      setShowSpinner(false);
      setshowNoAccountsMessage(true);
    }

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
      {showSpinner === true && showNoAccountsMessage === false && (
        <CardSpinner cardTitle="Cash Accounts" />
      )}
      {showSpinner === false && showNoAccountsMessage === true && (
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
      {cashAccAPIData !== undefined &&
        showSpinner === false &&
        showNoAccountsMessage === false && (
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
                  <CashAccountAccRow
                    key={data.account_id}
                    data={data}
                    updatedAllAccountBalances={updatedAllAccountBalances}
                    settriggerRecalculations={settriggerRecalculations}
                    triggerRecalculations={triggerRecalculations}
                    selectedCurrency={selectedCurrency}
                  />
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
