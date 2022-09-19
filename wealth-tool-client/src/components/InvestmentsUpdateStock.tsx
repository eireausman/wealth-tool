import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  InvestmentsUpdateStockProps,
  investmentUpdateStockFormData,
} from "../../../types/typeInterfaces";
import { updateInvestmentData } from "../modules/serverRequests";

const InvestmentsUpdateStock: React.FC<InvestmentsUpdateStockProps> = ({
  data,
  setshowEditStockForm,
  refreshInvestmentsData,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const [formData, setformData] = useState<investmentUpdateStockFormData>({
    holding_id: data.holding_id,
    quantity: data.holding_quantity_held,
    cost: data.holding_cost_total_value,
    institution: data.holding_institution,
  });

  const updateFormDataState = (e: React.FormEvent<EventTarget>) => {
    const formDataCopy: investmentUpdateStockFormData = { ...formData };
    const target = e.target as HTMLInputElement;

    const fieldName =
      target.getAttribute("name") ??
      (target.getAttribute("name") as keyof typeof FormData);

    formDataCopy[fieldName] = target.value;
    setformData(formDataCopy);
  };

  const cancelForm = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setshowEditStockForm(false);
  };

  const saveInvestmentEdits = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    try {
      await updateInvestmentData(
        formData.holding_id,
        formData.cost,
        formData.institution,
        formData.quantity
      );

      settriggerRecalculations(triggerRecalculations + 1);
      refreshInvestmentsData();
      setshowEditStockForm(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="viewCardRow">
      <motion.form
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="addNewStockForm"
        onSubmit={(e) => saveInvestmentEdits(e)}
      >
        <label className="newStockInputRow">
          Quantity Held
          <input
            name="quantity"
            className="newStockInputField"
            type="number"
            required
            onChange={updateFormDataState}
            value={formData.quantity}
          />
        </label>
        <label className="newStockInputRow">
          Total cost {data.holding_currency_code}{" "}
          <input
            name="cost"
            className="newStockInputField"
            type="number"
            required
            value={formData.cost}
            onChange={updateFormDataState}
          />
        </label>
        <label className="newStockInputRow">
          Broker / Bank Name
          <input
            name="institution"
            className="newStockInputField"
            type="text"
            required
            minLength={3}
            maxLength={35}
            value={formData.institution}
            onChange={updateFormDataState}
          />
        </label>
        <div className="newStockInputRow">
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

export default InvestmentsUpdateStock;
