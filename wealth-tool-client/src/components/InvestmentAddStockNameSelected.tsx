import { motion } from "framer-motion";
import React from "react";
import { AddNewInvestmentFormData } from "../../../types/typeInterfaces";
import "./InvestmentAddStockNameSelected.css";
import { GrSearchAdvanced } from "react-icons/gr";

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
      <div className="selectedStockContainerTitle">
        <h3>Selected Stock</h3>
        <span className="spyGlass" onClick={restartSearch}>
          {" "}
          search again
        </span>
      </div>
      <p className="selectedStockText">
        <span className="selectedStockTextTitle"> Stock Name: </span>
        {formData?.stockName}
      </p>
      <p className="selectedStockText">
        {" "}
        <span className="selectedStockTextTitle"> Listed on: </span>
        {formData?.stockMarket}
      </p>
      <p className="selectedStockText">
        {" "}
        <span className="selectedStockTextTitle">Market Identifier: </span>{" "}
        {formData?.identifier}
      </p>

      <p className="selectedStockText">
        {" "}
        <span className="selectedStockTextTitle">Valued in currency: </span>
        {formData?.currencyCode}
      </p>
    </motion.div>
  );
};

export default InvestmentAddStockNameSelected;
