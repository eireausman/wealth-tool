import React, { Fragment, useContext, useState } from "react";
import { motion } from "framer-motion";
import { companyNameSearchResults } from "../../../types/typeInterfaces";
import {
  AddANewInvestmentProps,
  AddNewInvestmentFormData,
} from "../../../types/typeInterfaces";
import "./InvestmentAddStock.css";
import {
  addnewinvestment,
  refreshSingleStockPricingData,
} from "../modules/serverRequests";
import InvestmentAddStockName from "./InvestmentAddStockName";
import ModalSavingData from "./ModalSavingData";
import { useCurrenciesFromDBContext } from "../modules/Contexts";

const InvestmentAddStock: React.FC<AddANewInvestmentProps> = ({
  setShowAddNewStockForm,
  refreshInvestmentsData,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const currencyCodesFromDB = useContext(useCurrenciesFromDBContext);
  const [formData, setformData] = useState<AddNewInvestmentFormData>();
  const [showSavingMessage, setshowSavingMessage] = useState<boolean>(false);
  const [saveProgressText, setsaveProgressText] = useState<string>(
    "Saving data. Not long now..."
  );
  const [showAdditionStockInfoFields, setshowAdditionStockInfoFields] =
    useState<boolean>(false);

  const cancelForm = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setShowAddNewStockForm(false);
  };

  const newStockNameSelectedFromSearch = (
    selectedCompany: companyNameSearchResults
  ) => {
    const formDataCopy: AddNewInvestmentFormData = { ...formData };
    formDataCopy.stockName = selectedCompany.company_name;
    formDataCopy.identifier = selectedCompany.company_symbol;
    formDataCopy.currencyCode =
      selectedCompany.stock_market.currencies_code.currency_code;
    formDataCopy.stockMarket = selectedCompany.stock_market.exchange_name;
    setformData(formDataCopy);
    setshowAdditionStockInfoFields(true);
  };

  const resetCompanyFormData = () => {
    const formDataCopy: AddNewInvestmentFormData = { ...formData };
    formDataCopy.stockName = undefined;
    formDataCopy.identifier = undefined;
    formDataCopy.currencyCode = undefined;
    formDataCopy.stockMarket = undefined;
    setformData(formDataCopy);
    setshowAdditionStockInfoFields(false);
  };

  const updateFormDataState = (e: React.FormEvent<EventTarget>) => {
    const formDataCopy: AddNewInvestmentFormData = { ...formData };
    const target = e.target as HTMLInputElement;

    const fieldName =
      target.getAttribute("name") ??
      (target.getAttribute("name") as keyof typeof FormData);

    formDataCopy[fieldName] = target.value;
    setformData(formDataCopy);
  };

  const saveNewInvestment = async (e: React.FormEvent<EventTarget>) => {
    setshowSavingMessage(true);
    e.preventDefault();

    if (formData) {
      const serverAddInvestment = await addnewinvestment(formData);
      setsaveProgressText(
        "Saved.  Obtaining pricing data for new investment..."
      );
      const serverGetPricing = await refreshSingleStockPricingData(formData);

      setsaveProgressText("Pricing obtained.  One sec...");
      settriggerRecalculations(triggerRecalculations + 1);
      refreshInvestmentsData();
      setShowAddNewStockForm(false);
    }
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
          className="addNewStockForm"
          onSubmit={(e) => saveNewInvestment(e)}
        >
          <span className="addNewStockFormHeading">Stock detail</span>
          <InvestmentAddStockName
            updateFormDataState={updateFormDataState}
            newStockNameSelectedFromSearch={newStockNameSelectedFromSearch}
            formData={formData}
            resetCompanyFormData={resetCompanyFormData}
          />
          {showAdditionStockInfoFields === true && (
            <Fragment>
              <label className="newStockInputRow">
                Quantity Held
                <input
                  name="quantity"
                  className="newStockInputField"
                  type="number"
                  required
                  onChange={updateFormDataState}
                />
              </label>
              <label className="newStockInputRow">
                Total cost {formData?.currencyCode}
                <input
                  name="cost"
                  className="newStockInputField"
                  type="number"
                  required
                  onChange={updateFormDataState}
                />
              </label>
              <label className="newStockInputRow">
                Owner Name
                <input
                  name="ownerName"
                  className="newStockInputField"
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
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
            </Fragment>
          )}
        </motion.form>
      )}
    </div>
  );
};

export default InvestmentAddStock;
