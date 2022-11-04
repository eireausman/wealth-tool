import { motion } from "framer-motion";
import React from "react";
import { selectedCurrencyDetails } from "../../../../types/typeInterfaces";
import CardSpinner from "../loaders/CardSpinner";
import "./ViewCardHeaderRow.css";

interface ViewCardHeaderRowSortingProps {
  rowIcon: JSX.Element;
  rowTitle: string;
}

const ViewCardHeaderRowSorting: React.FC<ViewCardHeaderRowSortingProps> = ({
  rowIcon,
  rowTitle,
}) => {
  return (
    <>
      <motion.div className="viewCardHeaderRow">
        <h3 className="viewCardHeading">
          {rowIcon}
          {rowTitle}
        </h3>
      </motion.div>
      <div className="viewCardSubHeading">
        <span></span>

        <div className="viewCardButtons">
          <button className="buttonWhite buttonSortingSpinner">
            <CardSpinner cardTitle="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewCardHeaderRowSorting;
