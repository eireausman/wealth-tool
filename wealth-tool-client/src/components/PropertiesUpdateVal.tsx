import React, { useState, useEffect, useRef, Fragment } from "react";
import { propertiesUpdateValProps } from "../../../types/typeInterfaces";
import { motion } from "framer-motion";
import "./PropertiesUpdateVal.css";

import { updatePropertyValue } from "../modules/serverRequests";
import ModalSavingData from "./ModalSavingData";
import SoftDeleteButtonConfirm from "./SoftDeleteButtonConfirm";
import { setLabels } from "react-chartjs-2/dist/utils";
import SoftDeleteButton from "./SoftDeleteButton";

const PropertiesUpdateVal: React.FC<propertiesUpdateValProps> = ({
  setpropertyToEdit,
  data,
  refreshPropertiesValues,
  settriggerRecalculations,
  triggerRecalculations,
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

    updatePropertyValue(
      data.property_id,
      data.property_valuation,
      data.property_loan_value
    )
      .then((data) => {
        setsaveProgressText("Saved.  One sec...");
        settriggerRecalculations(triggerRecalculations + 1);
        refreshPropertiesValues();
        setpropertyToEdit(-1);
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
    setpropertyToEdit(-1);
  };
  return (
    <Fragment>
      {showSavingMessage === true && (
        <ModalSavingData title={saveProgressText} />
      )}
      {showSavingMessage === false && showSoftDelConfirm === false && (
        <motion.form
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="editPropertyForm"
          onSubmit={(e) => saveNewPropValue(e)}
        >
          <span className="propertyValUpdateName">
            {data.property_nickname.toUpperCase()}
          </span>
          <label className="newPropertyValueInputRow">
            Valuation {data.property_valuation_curr_symbol}
            {}
            <input
              name="newPropertyValueInputBox"
              className="newPropertyValueInputBox"
              type="number"
              ref={newPropValueInputBox}
              value={propValuation}
              onChange={newPropValuation}
              required
            />
          </label>
          <label className="newPropertyValueInputRow">
            Loan Amount {data.property_valuation_curr_symbol}
            <input
              name="newPropertyLoanAmountInputBox"
              className="newPropertyLoanAmountInputBox"
              type="number"
              value={loanValue}
              onChange={newPropLoanAmount}
              required
            />
          </label>
          <div className="newPropertyValueInputRow">
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
      )}
      {showSoftDelConfirm === false && (
        <SoftDeleteButton setshowSoftDelConfirm={setshowSoftDelConfirm} />
      )}
      {showSoftDelConfirm === true && (
        <SoftDeleteButtonConfirm
          assetType="property"
          assetID={data.property_id}
          assetTitle={data.property_nickname}
          refreshBalances={refreshPropertiesValues}
          triggerRecalculations={triggerRecalculations}
          settriggerRecalculations={settriggerRecalculations}
          cancelForm={cancelForm}
        />
      )}
    </Fragment>
  );
};

export default PropertiesUpdateVal;
