import React, { useState, useEffect, Fragment } from "react";
import { CashAccountsProps } from "../../../types/typeInterfaces";
import { motion } from "framer-motion";
import "./CashAccounts.css";
import CardSpinner from "./CardSpinner";
import getDisplayNumber from "../modules/getDisplayNumber";
import CashAccountAddAcc from "./CashAccountAddAcc";
import { cashAccountAPIData } from "../../../types/typeInterfaces";
import {
  getCashAccountData,
  getNetCashAccountTotal,
} from "../modules/serverRequests";
import { AxiosResponse } from "axios";

import CashAccountAccRow from "./CashAccountAccRow";
import NoAssets from "./NoAssetsMessage";
import { BiSortAlt2 } from "react-icons/bi";

const CashAccounts: React.FC<CashAccountsProps> = ({
  selectedCurrencyCode,
  selectedCurrencySymbol,
  currencyCodesFromDB,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [showNoAccountsMessage, setshowNoAccountsMessage] = useState(false);
  const [cashAccountNetTotal, setcashAccountNetTotal] = useState<number>(0);

  const [cashAccAPIData, setcashAccAPIData] =
    useState<Array<cashAccountAPIData>>();

  const updatedAllAccountBalances = async () => {
    setShowSpinner(true);
    setshowNoAccountsMessage(false);
    setcashAccAPIData(undefined);
    const cashAccServerDataRequest: AxiosResponse<any, any> | undefined =
      await getCashAccountData(selectedCurrencyCode);

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

    const total = await getNetCashAccountTotal(selectedCurrencyCode);
    setcashAccountNetTotal(total);
  };

  //reload API data if currency changes:
  useEffect(() => {
    updatedAllAccountBalances();
  }, [selectedCurrencyCode]);

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
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="buttonWhite buttonAddNewEntry"
            onClick={showAddNewCashAccForm}
          >
            + Add Account
          </motion.button>
        </Fragment>
      )}
      {cashAccAPIData !== undefined &&
        showSpinner === false &&
        showNoAccountsMessage === false && (
          <Fragment>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="viewCardHeaderRow"
            >
              <h3 className="viewCardHeading">CASH ACCOUNTS</h3>
              <h3 className="viewCardTotal">
                {selectedCurrencySymbol} {getDisplayNumber(cashAccountNetTotal)}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="buttonWhite buttonAddNewEntry"
                  onClick={showAddNewCashAccForm}
                >
                  + Add Account
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="buttonWhite buttonAddNewEntry"
                  onClick={showAddNewCashAccForm}
                >
                  sort
                  <BiSortAlt2 />
                </motion.button>
              </h3>
            </motion.div>
            <section className="cashAccountsTable">
              <header className="cashAccountsTableHeader">
                <div className="table-header">A/c Name</div>
                <div className="table-header">Owner</div>
                <div className="table-header">Balance</div>
                <div className="table-header">Converted</div>
              </header>
              <section className="cashAccountsTableDataContainer scrollbarstyles">
                {cashAccAPIData?.map((data, index) => (
                  <CashAccountAccRow
                    key={data.account_id}
                    data={data}
                    selectedCurrencySymbol={selectedCurrencySymbol}
                    updatedAllAccountBalances={updatedAllAccountBalances}
                    settriggerRecalculations={settriggerRecalculations}
                    triggerRecalculations={triggerRecalculations}
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
              currencyCodesFromDB={currencyCodesFromDB}
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
