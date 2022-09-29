import React, { useState, useRef, useEffect } from "react";

import { motion } from "framer-motion";
import {
  AddNewCashAccountPropProps,
  AddNewCashAccountFormData,
} from "../../../types/typeInterfaces";
import "./CashAccountAddAcc.css";
import { addNewCashAccount } from "../modules/serverRequests";
import ModalSavingData from "./ModalSavingData";
const CashAccountAddAcc: React.FC<AddNewCashAccountPropProps> = ({
  currencyCodesFromDB,
  setshowAddNewForm,
  updatedAllAccountBalances,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const [formData, setformData] = useState<AddNewCashAccountFormData>();
  const currencyCodeSelection = useRef<HTMLSelectElement | null>(null);
  const [showSavingMessage, setshowSavingMessage] = useState<boolean>(false);
  const [saveProgressText, setsaveProgressText] = useState<string>(
    "Saving data. Not long now..."
  );
  const accountNicknameInputBox = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    accountNicknameInputBox.current !== null &&
      accountNicknameInputBox.current.focus();
  }, []);

  const cancelForm = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setshowAddNewForm(false);
  };

  const updateFormDataState = (e: React.FormEvent<EventTarget>) => {
    const formDataCopy: AddNewCashAccountFormData = { ...formData };
    const target = e.target as HTMLInputElement;

    const fieldName =
      target.getAttribute("name") ??
      (target.getAttribute("name") as keyof typeof formData);

    if (
      fieldName === "account_number_last4_digits" &&
      target.value.length > 4
    ) {
      console.log("greate than 4 digits");
      return;
    }
    formDataCopy[fieldName] = target.value;
    setformData(formDataCopy);
  };

  const saveNewCashAccount = (e: React.FormEvent<EventTarget>) => {
    setshowSavingMessage(true);
    e.preventDefault();
    // figure out the currency symbol to add to the db
    const currencyCodeForSubmission = currencyCodeSelection.current!.value;
    let currencySymbolForSubmission = "";
    currencyCodesFromDB?.forEach((currencyEntry) => {
      if (currencyEntry.currency_code === currencyCodeForSubmission) {
        currencySymbolForSubmission = currencyEntry.currency_symbol;
      }
    });

    const formDataForSubmission = {
      account_nickname: formData?.account_nickname,
      account_number_last4_digits: formData?.account_number_last4_digits,
      account_owner_name: formData?.account_owner_name,
      account_balance: formData?.account_balance,
      account_currency_code: currencyCodeForSubmission,
      account_currency_symbol: currencySymbolForSubmission,
    };

    addNewCashAccount(formDataForSubmission)
      .then((data) => {
        setsaveProgressText("Saved.  One sec...");
        settriggerRecalculations(triggerRecalculations + 1);
        updatedAllAccountBalances();
        setshowAddNewForm(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="viewCardRow">
      {showSavingMessage === true && (
        <ModalSavingData title={saveProgressText} />
      )}
      {showSavingMessage === false && (
        <motion.form
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="addNewCashAccForm"
          onSubmit={(e) => saveNewCashAccount(e)}
        >
          <span className="addNewCashAccFormHeading">New Cash Account</span>
          <label className="newCashAccInputRow">
            Account Nickname
            <input
              name="account_nickname"
              className="newCashAccInputField"
              type="text"
              required
              ref={accountNicknameInputBox}
              value={formData?.account_nickname}
              onChange={updateFormDataState}
            />
          </label>

          <label className="newCashAccInputRow">
            Account No. last 4 digits
            <input
              name="account_number_last4_digits"
              className="newCashAccInputField"
              type="number"
              required
              max={9999}
              value={formData?.account_number_last4_digits}
              onChange={updateFormDataState}
            />
          </label>

          <label className="newCashAccInputRow">
            Owner's Name
            <input
              name="account_owner_name"
              className="newCashAccInputField"
              type="text"
              required
              value={formData?.account_owner_name}
              onChange={updateFormDataState}
            />
          </label>
          <label className="newCashAccInputRow">
            Account Balance
            <input
              name="account_balance"
              placeholder="e.g. 1000"
              className="newCashAccInputField"
              type="number"
              required
              value={formData?.account_balance}
              onChange={updateFormDataState}
            />
          </label>
          <label className="newCashAccInputRow">
            Balance currency:
            <select
              className="newCashAccInputField"
              name="currencyCode"
              id="currencyCode"
              ref={currencyCodeSelection}
              onChange={updateFormDataState}
            >
              {currencyCodesFromDB?.map((data) => (
                <option key={data.id} value={data.currency_code}>
                  {data.currency_name}
                </option>
              ))}
            </select>
          </label>

          <div className="newCashAccInputRow">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              className="buttonPrimary"
              onClick={cancelForm}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              className="buttonPrimary"
              type="submit"
            >
              Save
            </motion.button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default CashAccountAddAcc;
