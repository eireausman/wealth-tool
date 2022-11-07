import React, { Fragment } from "react";
import { InvestmentRowUpdatingPricesProps } from "../../../../types/typeInterfaces";
import { motion } from "framer-motion";
import Shimmer from "../loaders/Shimmer";
import styles from "./InvestmentRowUpdatingPrices.module.css";

const InvestmentRowUpdatingPrices: React.FC<
  InvestmentRowUpdatingPricesProps
> = ({ data }) => {
  return (
    <Fragment>
      <motion.div className="investmentsTableDataGridRow" tabIndex={0}>
        <div>{data.holding_stock_name}</div>
        <div className={styles.columnInWideViewOnly}>
          {data.holding_owner_name}
        </div>
        <div className={styles.columnInWideViewOnly}>
          {data.holding_institution}
        </div>
        <div className={styles.columnInWideViewOnly}>
          {data.holding_currency_code}
        </div>
        <div>
          <Shimmer height={"1em"} width={"40px"} borderRadiusPX={"1px"} />
        </div>
        <div className={styles.columnInWideViewOnly}>
          <Shimmer height={"1em"} width={"40px"} borderRadiusPX={"1px"} />
        </div>
        <div className={styles.columnInWideViewOnly}>
          <Shimmer height={"1em"} width={"40px"} borderRadiusPX={"1px"} />
        </div>
        <div>
          <Shimmer height={"1em"} width={"40px"} borderRadiusPX={"1px"} />
        </div>
      </motion.div>
    </Fragment>
  );
};

export default InvestmentRowUpdatingPrices;
