import React, { Fragment } from "react";
import { InvestmentRowUpdatingPricesProps } from "../../../types/typeInterfaces";
import { motion } from "framer-motion";
import Shimmer from "./Shimmer";

const InvestmentRowUpdatingPrices: React.FC<
  InvestmentRowUpdatingPricesProps
> = ({ data }) => {
  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="investmentsTableDataGridRow"
        tabIndex={0}
      >
        <div>{data.holding_stock_name}</div>
        <div className="columnInWideViewOnly">{data.holding_owner_name}</div>
        <div className="columnInWideViewOnly"> {data.holding_institution}</div>
        <div className="columnInWideViewOnly">
          {" "}
          {data.holding_currency_code}
        </div>
        <div>
          <Shimmer height={20} width={40} borderRadiusPX={1} />
        </div>
        <div className="columnInWideViewOnly">
          <Shimmer height={20} width={40} borderRadiusPX={1} />
        </div>
        <div className="columnInWideViewOnly">
          <Shimmer height={20} width={40} borderRadiusPX={1} />
        </div>
        <div>
          <Shimmer height={20} width={40} borderRadiusPX={1} />
        </div>
      </motion.div>
    </Fragment>
  );
};

export default InvestmentRowUpdatingPrices;
