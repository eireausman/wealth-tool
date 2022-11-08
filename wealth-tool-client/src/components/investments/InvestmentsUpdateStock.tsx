import React, { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  InvestmentsUpdateStockProps,
  investmentUpdateStockFormData,
} from "../../../../types/typeInterfaces";
import { updateInvestmentData } from "../../modules/serverRequests";
import styles from "./InvestmentsUpdateStock.module.css";
import ModalSavingData from "../modals/ModalSavingData";
import SoftDeleteButton from "../buttons/SoftDeleteButton";
import SoftDeleteButtonConfirm from "../buttons/SoftDeleteButtonConfirm";

const InvestmentsUpdateStock: React.FC<InvestmentsUpdateStockProps> = ({
  data,
  setshowEditStockForm,
  settriggerRecalculations,
  triggerRecalculations,
  checkForEscapeKey,
  setentryIDWasDeleted,
  setthisItemIdBeingEdited,
}) => {
  const [formData, setformData] = useState<investmentUpdateStockFormData>({
    holding_id: data.holding_id,
    quantity: data.holding_quantity_held,
    cost: data.holding_cost_total_value,
    institution: data.holding_institution,
  });
  const [showSoftDelConfirm, setshowSoftDelConfirm] = useState<boolean>(false);
  const [showSavingMessage, setshowSavingMessage] = useState<boolean>(false);
  const [saveProgressText, setsaveProgressText] = useState<string>(
    "Saving data. Not long now..."
  );

  const investQtyInputBox = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    investQtyInputBox.current !== null && investQtyInputBox.current.focus();
  }, []);

  const updateFormDataState = (e: React.FormEvent<EventTarget>) => {
    const formDataCopy: investmentUpdateStockFormData = { ...formData };
    const target = e.target as HTMLInputElement;

    const fieldName =
      target.getAttribute("name") ??
      (target.getAttribute("name") as keyof typeof FormData);

    formDataCopy[fieldName] = target.value;
    setformData(formDataCopy);
  };

  const cancelForm = () => {
    setshowEditStockForm(false);
  };

  const saveInvestmentEdits = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setshowSavingMessage(true);
    try {
      await updateInvestmentData(
        formData.holding_id,
        formData.cost,
        formData.institution,
        formData.quantity
      );
      setsaveProgressText("Saved.  One sec...");
      settriggerRecalculations(triggerRecalculations + 1);
      setthisItemIdBeingEdited(data.holding_id);
      setshowEditStockForm(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="viewCardRow" onKeyUp={(e) => checkForEscapeKey(e)}>
      {showSavingMessage === true && (
        <ModalSavingData title={saveProgressText} />
      )}
      {showSavingMessage === false && showSoftDelConfirm === false && (
        <Fragment>
          <p className={styles.stockName}>
            {data?.holding_stock_name} ({data.holding_market_identifier})
          </p>

          <motion.form
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={styles.addNewStockForm}
            onSubmit={(e) => saveInvestmentEdits(e)}
          >
            <label className={styles.newStockInputRow}>
              Quantity Held
              <input
                name="quantity"
                className={styles.newStockInputField}
                type="number"
                ref={investQtyInputBox}
                required
                onChange={updateFormDataState}
                value={formData.quantity}
              />
            </label>
            <label className={styles.newStockInputRow}>
              Total cost {data.holding_currency_code}{" "}
              <input
                name="cost"
                className={styles.newStockInputField}
                type="number"
                required
                value={formData.cost}
                onChange={updateFormDataState}
              />
            </label>
            <label className={styles.newStockInputRow}>
              Broker / Bank Name
              <input
                name="institution"
                className={styles.newStockInputField}
                type="text"
                required
                minLength={3}
                maxLength={35}
                value={formData.institution}
                onChange={updateFormDataState}
              />
            </label>
            <div className={styles.newStockInputRow}>
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
            {showSoftDelConfirm === false && (
              <SoftDeleteButton setshowSoftDelConfirm={setshowSoftDelConfirm} />
            )}
          </motion.form>
        </Fragment>
      )}
      {showSoftDelConfirm === true && (
        <SoftDeleteButtonConfirm
          assetType="investment"
          assetID={data.holding_id}
          assetTitle={data.holding_stock_name}
          triggerRecalculations={triggerRecalculations}
          settriggerRecalculations={settriggerRecalculations}
          cancelForm={cancelForm}
          setentryIDWasDeleted={setentryIDWasDeleted}
        />
      )}
    </div>
  );
};

export default InvestmentsUpdateStock;
