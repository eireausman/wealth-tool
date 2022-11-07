import { motion } from "framer-motion";
import React from "react";
import CardSpinner from "../loaders/CardSpinner";
import styles from "./ViewCardHeaderRow.module.css";

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
      <motion.div className={styles.viewCardHeaderRow}>
        <h3 className={styles.viewCardHeading}>
          {rowIcon}
          {rowTitle}
        </h3>
      </motion.div>
      <div className={styles.viewCardSubHeading}>
        <span></span>

        <div className={styles.viewCardButtons}>
          <button className={`${styles.buttonSortingSpinner} buttonWhite `}>
            <CardSpinner cardTitle="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewCardHeaderRowSorting;
