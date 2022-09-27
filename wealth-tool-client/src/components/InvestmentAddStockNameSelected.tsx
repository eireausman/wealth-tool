import { motion } from "framer-motion";
import React from "react";
import { AddNewInvestmentFormData } from "../../../types/typeInterfaces";
import "./InvestmentAddStockNameSelected.css";

interface InvestmentAddStockNameSelectedProps {
  formData: AddNewInvestmentFormData | undefined;
  dispatch: React.Dispatch<any>;
  resetCompanyFormData: () => void;
}

const InvestmentAddStockNameSelected: React.FC<
  InvestmentAddStockNameSelectedProps
> = ({ formData, dispatch, resetCompanyFormData }) => {
  const restartSearch = () => {
    dispatch({ type: "resetSearch" });
    resetCompanyFormData();
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="selectedStockContainer"
    >
      <span className="selectedStockTextTitle"> Stock Name: </span>
      <p className="selectedStockText">{formData?.stockName}</p>

      <p className="selectedStockText">
        {" "}
        <span className="selectedStockTextTitle"> Listed on: </span>
        {formData?.stockMarket} ({formData?.identifier})
      </p>

      <p className="selectedStockText">
        {" "}
        <span className="selectedStockTextTitle">Valued in currency: </span>
        {formData?.currencyCode}
      </p>
      <div className="selectedStockContainerSeachAgain">
        <span className="spyGlass" onClick={restartSearch}>
          {" "}
          search again
        </span>
      </div>
    </motion.div>
  );
};

export default InvestmentAddStockNameSelected;
