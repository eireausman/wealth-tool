import { motion } from "framer-motion";
import React from "react";
import { selectedCurrencyDetails } from "../../../../types/typeInterfaces";
import getDisplayNumber from "../../modules/getDisplayNumber";
import ButtonAddAsset from "../buttons/ButtonAddAsset";
import ButtonSort from "../buttons/ButtonSort";
import Shimmer from "../loaders/Shimmer";
import styles from "./ViewCardHeaderRow.module.css";

interface selectDropDownSortArray {
  readableString: string;
  dbField: string;
}

interface ViewCardHeaderRowProps {
  rowIcon: JSX.Element;
  rowTitle: string;
  netTotal: number | undefined;
  addNewFunction: React.Dispatch<React.SetStateAction<boolean>>;
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
      <motion.div className={styles.viewCardHeaderRow}>
        <h3 className={styles.viewCardHeading}>
          {rowIcon}
          {rowTitle}
        </h3>
      </motion.div>
      <div className={styles.viewCardSubHeading}>
        <h3 className={styles.viewCardTotal}>
          {netTotal === undefined ? (
            <Shimmer height={"1em"} width={"60px"} borderRadiusPX={"5px"} />
          ) : (
            <>
              {selectedCurrency.currency_code} {getDisplayNumber(netTotal)}
            </>
          )}
        </h3>

        <div className={styles.viewCardButtons}>
          <ButtonSort
            sortArray={sortArray}
            orderByThisColumn={orderByThisColumn}
            setorderByThisColumn={setorderByThisColumn}
          />

          <ButtonAddAsset
            clickFunction={() => addNewFunction(true)}
            buttonTextContent="Add"
          />
        </div>
      </div>
    </>
  );
};

export default ViewCardHeaderRow;
