import { motion } from "framer-motion";
import React, { Fragment } from "react";
import { FaEdit } from "react-icons/fa";
import { CashAccountAccRowUpdatingValsProps } from "../../../../types/typeInterfaces";

import Shimmer from "../loaders/Shimmer";

import styles from "./CashAccountAccRow.module.css";

const CashAccountAccRowUpdatingVals: React.FC<
  CashAccountAccRowUpdatingValsProps
> = ({ data }) => {
  return (
    <Fragment>
      <motion.div className={styles.cashAccountsTableDataGridRow}>
        <div>
          {data.account_nickname.toUpperCase()}
          <FaEdit className="editValueIcon" color={"#087fed"} />
        </div>
        <div>{data.account_owner_name.toUpperCase()}</div>

        <div>
          <Shimmer height={"1em"} width={"70px"} borderRadiusPX={"1px"} />
        </div>
      </motion.div>
    </Fragment>
  );
};

export default CashAccountAccRowUpdatingVals;
