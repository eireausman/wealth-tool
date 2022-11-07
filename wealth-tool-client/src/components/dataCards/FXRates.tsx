import React, { useContext, useEffect, useState } from "react";
import { allFXRatesAPIData } from "../../../../types/typeInterfaces";
import { getAllFXRateData } from "../../modules/serverRequests";
import styles from "./FXRates.module.css";
import { motion } from "framer-motion";
import { useAssetCountContext } from "../../modules/Contexts";

const FXRates: React.FC = () => {
  const [allFXRatesAPIData, setallFXRatesAPIData] =
    useState<Array<allFXRatesAPIData>>();
  useEffect(() => {
    getAllFXRateData().then((data) => {
      setallFXRatesAPIData(data);
    });
  }, []);

  const assetCount = useContext(useAssetCountContext);
  if (assetCount.totalAssetCount === 0) return null;

  return (
    <section className="viewCard">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="viewCardHeaderRow"
      >
        <h3 className="viewCardHeading">FX RATES</h3>
      </motion.div>
      <section className={styles.FXRatesTable}>
        <header className={styles.FXRatesTableHeader}>
          <div className={styles.tableHeader}>FX Pair</div>
          <div className={styles.tableHeader}>As At</div>
          <div className={styles.tableHeader}>Rate</div>
        </header>
        <section
          className={`${styles.FXRatesTableDataContainer} scrollbarstyles`}
        >
          {allFXRatesAPIData?.map((data) => (
            <div className={styles.FXRatesTableDataGridRow} key={data.id}>
              <div>
                {data.currency_code_from} / {data.currency_code_to}
              </div>
              <div>{data.virtual_lastUpdatedDay}</div>
              <div>{data.currency_fxrate}</div>
            </div>
          ))}
        </section>
      </section>
    </section>
  );
};

export default FXRates;
