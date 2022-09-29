import { motion } from "framer-motion";
import React from "react";
import { BiSortAlt2 } from "react-icons/bi";
import getDisplayNumber from "../modules/getDisplayNumber";
import ButtonAddAsset from "./ButtonAddAsset";

interface ViewCardHeaderRowProps {
  rowIcon: JSX.Element;
  rowTitle: string;
  selectedCurrencySymbol: string;
  netTotal: number;
  clickFunction: () => void;
}

const ViewCardHeaderRow: React.FC<ViewCardHeaderRowProps> = ({
  rowIcon,
  rowTitle,
  selectedCurrencySymbol,
  netTotal,
  clickFunction,
}) => {
  return (
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
      <h3 className="viewCardTotal">
        {selectedCurrencySymbol} {getDisplayNumber(netTotal)}
        <ButtonAddAsset
          clickFunction={clickFunction}
          buttonTextContent="Add Account"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="buttonWhite buttonAddNewEntry"
          onClick={clickFunction}
        >
          sort
          <BiSortAlt2 />
        </motion.button>
      </h3>
    </motion.div>
  );
};

export default ViewCardHeaderRow;
