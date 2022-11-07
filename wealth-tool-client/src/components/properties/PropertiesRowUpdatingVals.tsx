import { motion } from "framer-motion";
import React, { Fragment, useState } from "react";
import {
  propertiesAPIData,
  selectedCurrencyDetails,
} from "../../../../types/typeInterfaces";
import styles from "./PropertiesRow.module.css";
import { FaEdit } from "react-icons/fa";
import Shimmer from "../loaders/Shimmer";

interface PropertiesRowUpdatingValsProps {
  data: propertiesAPIData;
  selectedCurrency: selectedCurrencyDetails;
}

const PropertiesRowUpdatingVals: React.FC<PropertiesRowUpdatingValsProps> = ({
  data,
  selectedCurrency,
}) => {
  return (
    <Fragment>
      <motion.div
        className={`${styles.propertiesViewCardRow} viewCardRow`}
        key={data.property_id}
        tabIndex={0}
      >
        <div className={`${styles.PropertyLeftBox} viewCardRowLeftBox`}>
          <span className={styles.propertyName}>
            {data.property_nickname.toUpperCase()}
            <FaEdit className="editValueIcon" color={"#087fed"} />
          </span>
          <span className={styles.ownerText}>
            Owner: {data.property_owner_name}
          </span>
          <span className={styles.valueBaseCurrency}>
            Currency: {data.property_valuation_currency}
          </span>
        </div>
        <div className="viewCardRowRightBox">
          <motion.table className={styles.valuesTable}>
            <tbody>
              <tr className={styles.calculatedBalanceValueRow}>
                <td>Net {selectedCurrency.currency_code}: </td>
                <td>
                  <Shimmer
                    height={"1em"}
                    width={"46px"}
                    borderRadiusPX={"1px"}
                  />
                </td>
              </tr>
              <tr>
                <td>Valuation: </td>
                <td>
                  <Shimmer
                    height={"1em"}
                    width={"46px"}
                    borderRadiusPX={"1px"}
                  />
                </td>
              </tr>
              <tr>
                <td>Loan: </td>
                <td>
                  <Shimmer
                    height={"1em"}
                    width={"46px"}
                    borderRadiusPX={"1px"}
                  />
                </td>
              </tr>
              <tr>
                <td>Net Val: </td>
                <td>
                  <Shimmer
                    height={"1em"}
                    width={"46px"}
                    borderRadiusPX={"1px"}
                  />
                </td>
              </tr>
            </tbody>
          </motion.table>
        </div>
      </motion.div>
    </Fragment>
  );
};

export default PropertiesRowUpdatingVals;
