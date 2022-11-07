import React, { useState, useEffect, useRef } from "react";
import { propertiesUpdateValProps } from "../../../../types/typeInterfaces";
import { motion } from "framer-motion";
import styles from "./PropertiesUpdateVal.module.css";
import { updatePropertyValue } from "../../modules/serverRequests";
import ModalSavingData from "../modals/ModalSavingData";
import SoftDeleteButtonConfirm from "../buttons/SoftDeleteButtonConfirm";
import SoftDeleteButton from "../buttons/SoftDeleteButton";

const PropertiesUpdateVal: React.FC<propertiesUpdateValProps> = ({
  data,
  settriggerRecalculations,
  triggerRecalculations,
  setshowEditPropertyForm,
  checkForEscapeKey,
  itemDetailUpdated,
  setentryIDWasDeleted,
}) => {
  const [propValuation, setpropValuation] = useState<number>(
    data.property_valuation
  );
  const [loanValue, setloanValue] = useState<number>(data.property_loan_value);
  const [showSoftDelConfirm, setshowSoftDelConfirm] = useState<boolean>(false);
  const [showSavingMessage, setshowSavingMessage] = useState<boolean>(false);
  const [saveProgressText, setsaveProgressText] = useState<string>(
    "Saving data. Not long now..."
  );

  const newPropValueInputBox = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    newPropValueInputBox.current!.focus();
  }, []);

  const saveNewPropValue = (e: React.FormEvent<EventTarget>) => {
    setshowSavingMessage(true);
    e.preventDefault();

    updatePropertyValue(data.property_id, propValuation, loanValue)
      .then((returnData) => {
        setsaveProgressText("Saved.  One sec...");
        settriggerRecalculations(triggerRecalculations + 1);
        itemDetailUpdated(data.property_id);
      })
      .catch((err) => console.log(err));
  };

  const newPropValuation = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    const number = parseInt(target.value);
    setpropValuation(number);
  };
  const newPropLoanAmount = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    const number = parseInt(target.value);
    setloanValue(number);
  };
  const cancelForm = () => {
    setshowEditPropertyForm(false);
  };
  return (
    <div className="viewCardRow" onKeyUp={(e) => checkForEscapeKey(e)}>
      {showSavingMessage === true && (
        <ModalSavingData title={saveProgressText} />
      )}

      {showSavingMessage === false && showSoftDelConfirm === false && (
        <motion.form
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.editPropertyForm}
          onSubmit={(e) => saveNewPropValue(e)}
        >
          <span className={styles.propertyValUpdateName}>
            {data.property_nickname.toUpperCase()}
          </span>
          <label className={styles.newPropertyValueInputRow}>
            Valuation {data.property_valuation_curr_symbol}
            {}
            <input
              name={styles.newPropertyValueInputBox}
              className={styles.newPropertyValueInputBox}
              type="number"
              ref={newPropValueInputBox}
              value={propValuation}
              onChange={newPropValuation}
              required
            />
          </label>
          <label className={styles.newPropertyValueInputRow}>
            Loan Amount {data.property_valuation_curr_symbol}
            <input
              name={styles.newPropertyLoanAmountInputBox}
              className={styles.newPropertyLoanAmountInputBox}
              type="number"
              value={loanValue}
              onChange={newPropLoanAmount}
              required
            />
          </label>
          <div className={styles.newPropertyValueInputRow}>
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
              className="buttonPrimary"
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
          assetType="property"
          assetID={data.property_id}
          assetTitle={data.property_nickname}
          triggerRecalculations={triggerRecalculations}
          settriggerRecalculations={settriggerRecalculations}
          cancelForm={cancelForm}
          setentryIDWasDeleted={setentryIDWasDeleted}
        />
      )}
    </div>
  );
};

export default PropertiesUpdateVal;
