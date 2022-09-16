import React, { useEffect, useState } from "react";
import { allFXRatesAPIData } from "../../../types/typeInterfaces";
import { getAllFXRateData } from "../modules/serverRequests";
import "./FXRates.css";
import { motion } from "framer-motion";

const FXRates: React.FC = () => {
  const [allFXRatesAPIData, setallFXRatesAPIData] =
    useState<Array<allFXRatesAPIData>>();
  useEffect(() => {
    getAllFXRateData().then((data) => {
      setallFXRatesAPIData(data);
    });
  }, []);

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
      <section className="FXRatesTable">
        <header className="FXRatesTableHeader">
          <div className="table-header">FX Pair</div>
          <div className="table-header">As At</div>
          <div className="table-header">Rate</div>
        </header>
        <section className="FXRatesTableDataContainer">
          {allFXRatesAPIData?.map((data) => (
            <div className="FXRatesTableDataGridRow">
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
