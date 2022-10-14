import { motion } from "framer-motion";
import React from "react";
import { selectedCurrencyDetails } from "../../../types/typeInterfaces";
import getDisplayNumber from "../modules/getDisplayNumber";
import ButtonAddAsset from "./ButtonAddAsset";
import ButtonSort from "./ButtonSort";
import Shimmer from "./Shimmer";
import "./ViewCardHeaderRow.css";

interface selectDropDownSortArray {
  readableString: string;
  dbField: string;
}

interface ViewCardHeaderRowProps {
  rowIcon: JSX.Element;
  rowTitle: string;
  netTotal: number | undefined;
  addNewFunction: () => void;
  selectedCurrency: selectedCurrencyDetails;
  sortArray: Array<selectDropDownSortArray>;
  orderByThisColumn: string;
  setorderByThisColumn: React.Dispatch<React.SetStateAction<string>>;
}

const ViewCardHeaderRow: React.FC<ViewCardHeaderRowProps> = ({
  rowIcon,
  rowTitle,
  netTotal,
  addNewFunction,
  selectedCurrency,
  sortArray,
  orderByThisColumn,
  setorderByThisColumn,
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="viewCardHeaderRow"
      >
        <h3 className="viewCardHeading">
          {rowIcon}
          {rowTitle}
        </h3>
      </motion.div>
      <div className="viewCardSubHeading">
        <h3 className="viewCardTotal">
          {netTotal === undefined ? (
            <Shimmer height={"1em"} width={"60px"} borderRadiusPX={"1px"} />
          ) : (
            <>
              {selectedCurrency.currency_code} {getDisplayNumber(netTotal)}
            </>
          )}
        </h3>
        <div className="viewCardButtons">
          <ButtonSort
            sortArray={sortArray}
            orderByThisColumn={orderByThisColumn}
            setorderByThisColumn={setorderByThisColumn}
          />

          <ButtonAddAsset
            clickFunction={addNewFunction}
            buttonTextContent="Add"
          />
        </div>
      </div>
    </>
  );
};

export default ViewCardHeaderRow;
