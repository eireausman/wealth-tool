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

import CashAccountAccRow from "./CashAccountAccRow";

const CashAccounts: React.FC<CashAccountsProps> = ({
  selectedCurrencyCode,
  selectedCurrencySymbol,
  currencyCodesFromDB,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [cashAccountNetTotal, setcashAccountNetTotal] = useState<number>(0);

  const [cashAccAPIData, setcashAccAPIData] =
    useState<Array<cashAccountAPIData>>();

  const updatedAllAccountBalances = async () => {
    const cashAcData: Array<cashAccountAPIData> = await getCashAccountData(
      selectedCurrencyCode
    );
    setcashAccAPIData(cashAcData);

    const total = await getNetCashAccountTotal(selectedCurrencyCode);
    setcashAccountNetTotal(total);
  };

  //reload API data if currency changes:
  useEffect(() => {
    updatedAllAccountBalances();
  }, [selectedCurrencyCode]);

  // remove the loading status if cash account data populated in state
  useEffect(() => {
    if (cashAccAPIData && cashAccAPIData.length !== 0) {
      setShowSpinner(false);
    }
  }, [cashAccAPIData]);

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
      {showSpinner === true ? (
        <CardSpinner cardTitle="Cash Accounts" />
      ) : (
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
            </h3>
          </motion.div>
          <section className="cashAccountsTable">
            <header className="cashAccountsTableHeader">
              <div className="table-header">A/c Name</div>
              <div className="table-header">Owner</div>
              <div className="table-header">Balance</div>
              <div className="table-header">Converted</div>
            </header>
            <section className="cashAccountsTableDataContainer">
              {cashAccAPIData?.map((data, index) => (
                <CashAccountAccRow
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
