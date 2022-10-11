import React, { useEffect, useRef, useState } from "react";
import { updateCashAccountBalance } from "../modules/serverRequests";
import { CashAccountUpdateBalProps } from "../../../types/typeInterfaces";
import "./CashAccountUpdBal.css";
import { motion } from "framer-motion";
import SoftDeleteButton from "./SoftDeleteButton";
import SoftDeleteButtonConfirm from "./SoftDeleteButtonConfirm";
import ModalSavingData from "./ModalSavingData";

const CashAccountUpdBal: React.FC<CashAccountUpdateBalProps> = ({
  data,
  setShowEditAccountForm,
  updatedAllAccountBalances,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const [updatedBalance, setupdatedBalance] = useState<number>(0);
  const [showSoftDelConfirm, setshowSoftDelConfirm] = useState<boolean>(false);
  const [showSavingMessage, setshowSavingMessage] = useState<boolean>(false);
  const [saveProgressText, setsaveProgressText] = useState<string>(
    "Saving data. Not long now..."
  );

  useEffect(() => {
    newAccountBalanceInputBox.current !== null &&
      newAccountBalanceInputBox.current.focus();
  }, []);

  useEffect(() => {
    setupdatedBalance(data.account_balance);
  }, [data]);

  const newAccountBalance = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    const number = parseInt(target.value);
    setupdatedBalance(number);
  };

  const cancelForm = () => {
    setShowEditAccountForm(false);
  };

  const newAccountBalanceInputBox = useRef<HTMLInputElement | null>(null);

  const saveNewAccountBalance = (e: React.FormEvent<EventTarget>) => {
    setshowSavingMessage(true);
    e.preventDefault();

    updateCashAccountBalance(data.account_id, updatedBalance)
      .then((data) => {
        setsaveProgressText("Saved.  One sec...");
        updatedAllAccountBalances();
        settriggerRecalculations(triggerRecalculations + 1);
        setShowEditAccountForm(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="viewCardRow">
      {showSavingMessage === true && (
        <ModalSavingData title={saveProgressText} />
      )}
      {showSavingMessage === false && showSoftDelConfirm === false && (
        <motion.form
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="editAccountBalForm"
          onSubmit={saveNewAccountBalance}
        >
          <span className="accountNickname">{data.account_nickname}</span>

          <div className="currencySymbolWrapper">
            {data.currencySymbol}
            <input
              name="newAccountBalanceInputBox"
              className="newAccountBalanceInputBox"
              type="number"
              ref={newAccountBalanceInputBox}
              value={updatedBalance}
              onChange={newAccountBalance}
              required
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              className="buttonPrimary buttonCashBalSave"
              onClick={cancelForm}
              type="button"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              className="buttonPrimary buttonCashBalSave"
              type="submit"
            >
              Save
            </motion.button>
          </div>
          {showSoftDelConfirm === false && (
            <SoftDeleteButton setshowSoftDelConfirm={setshowSoftDelConfirm} />
          )}
        </motion.form>
      )}

      {showSoftDelConfirm === true && (
        <SoftDeleteButtonConfirm
          assetType="cashAccount"
          assetID={data.account_id}
          assetTitle={data.account_nickname}
          refreshBalances={updatedAllAccountBalances}
          triggerRecalculations={triggerRecalculations}
          settriggerRecalculations={settriggerRecalculations}
          cancelForm={cancelForm}
        />
      )}
    </div>
  );
};

export default CashAccountUpdBal;
