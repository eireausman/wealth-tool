import React, { useEffect, useRef, useState } from "react";
import { updateCashAccountBalance } from "../modules/serverRequests";
import { CashAccountUpdateBalProps } from "../../../types/typeInterfaces";
import "./CashAccountUpdBal.css";
import { motion } from "framer-motion";

const CashAccountUpdBal: React.FC<CashAccountUpdateBalProps> = ({
  data,
  setShowEditAccountForm,
  updatedAllAccountBalances,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const [updatedBalance, setupdatedBalance] = useState<number>(0);

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

  const cancelForm = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setShowEditAccountForm(false);
  };

  const newAccountBalanceInputBox = useRef<HTMLInputElement | null>(null);

  const saveNewAccountBalance = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    updateCashAccountBalance(data.account_id, updatedBalance)
      .then((data) => {
        updatedAllAccountBalances();
        settriggerRecalculations(triggerRecalculations + 1);
        setShowEditAccountForm(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="viewCardRow">
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
      </motion.form>
    </div>
  );
};

export default CashAccountUpdBal;
