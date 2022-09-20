import React, { useState, useEffect, Fragment } from "react";
import { InvestmentsProps } from "../../../types/typeInterfaces";
import { motion } from "framer-motion";
import CardSpinner from "./CardSpinner";
import "./Investments.css";
import getDisplayNumber from "../modules/getDisplayNumber";
import InvestmentAddStock from "./InvestmentAddStock";
import InvestmentRow from "./InvestmentRow";
import { investmentsAPIData } from "../../../types/typeInterfaces";
import {
  getInvestmentData,
  getNetInvestmentTotal,
} from "../modules/serverRequests";
import NoAssets from "./NoAssetsMessage";
import { AxiosResponse } from "axios";

const Investments: React.FC<InvestmentsProps> = ({
  selectedCurrencyCode,
  selectedCurrencySymbol,
  currencyCodesFromDB,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [showNoAccountsMessage, setshowNoAccountsMessage] = useState(false);

  const [showAddNewStockForm, setShowAddNewStockForm] =
    useState<boolean>(false);
  const [investmentAPIData, setinvestmentAPIData] =
    useState<Array<investmentsAPIData>>();
  const [investmentsTotalValue, setInvestmentsTotalValue] = useState<number>(0);

  const refreshInvestmentsData = async () => {
    setinvestmentAPIData(undefined);
    setShowSpinner(true);
    const investData: AxiosResponse<any, any> | undefined =
      await getInvestmentData(selectedCurrencyCode);

    if (
      investData !== undefined &&
      investData.status === 200 &&
      investData.data !== undefined
    ) {
      setinvestmentAPIData(investData.data);
      setshowNoAccountsMessage(false);
    } else if (investData !== undefined && investData.status === 204) {
      setshowNoAccountsMessage(true);
    }

    const total = await getNetInvestmentTotal(selectedCurrencyCode);
    setInvestmentsTotalValue(total);
    setShowSpinner(false);
  };

  //reload API data if currency changes:
  useEffect(() => {
    refreshInvestmentsData();
  }, [selectedCurrencyCode]);

  // remove the loading status if cash account data populated in state
  useEffect(() => {
    if (investmentAPIData && investmentAPIData.length !== 0) {
      setShowSpinner(false);
    }
  }, [investmentAPIData]);

  const addANewStock = () => {
    setShowAddNewStockForm(true);
  };

  const closeModal = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className === "newAdditionModal") {
      setShowAddNewStockForm(false);
    }
  };

  return (
    <section className="viewCard">
      {showSpinner === true && <CardSpinner cardTitle="Investments" />}
      {showNoAccountsMessage === true && (
        <Fragment>
          <NoAssets
            cardTitle="Investments"
            cardText="No investments being tracked"
            assetType="investment"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="buttonWhite buttonAddNewEntry"
            onClick={addANewStock}
          >
            + Add Stock
          </motion.button>
        </Fragment>
      )}
      {investmentAPIData !== undefined && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="viewCardHeaderRow"
          >
            <h3 className="viewCardHeading">INVESTMENTS</h3>
            <h3 className="viewCardTotal">
              {" "}
              {selectedCurrencySymbol} {getDisplayNumber(investmentsTotalValue)}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="buttonWhite buttonAddNewEntry"
                onClick={addANewStock}
              >
                + Add Stock
              </motion.button>
            </h3>
          </motion.div>
          <section className="investmentsTable">
            <header className="investmentsTableHeader">
              <div className="table-header">Holding</div>
              <div className="table-header columnInWideViewOnly">Owner</div>
              <div className="table-header columnInWideViewOnly">Held at</div>
              <div className="table-header columnInWideViewOnly">Currency</div>
              <div className="table-header">Quantity</div>
              <div className="table-header columnInWideViewOnly">Price</div>
              <div className="table-header columnInWideViewOnly">Cost</div>
              <div className="table-header">Value</div>
            </header>
            <section className="investmentsTableDataContainer scrollbarstyles">
              {investmentAPIData?.map((data, index) => (
                <InvestmentRow
                  key={data.holding_id}
                  data={data}
                  selectedCurrencySymbol={selectedCurrencySymbol}
                  refreshInvestmentsData={refreshInvestmentsData}
                  settriggerRecalculations={settriggerRecalculations}
                  triggerRecalculations={triggerRecalculations}
                />
              ))}
            </section>
          </section>
        </Fragment>
      )}

      {showAddNewStockForm === true && (
        <div className="newAdditionModal" onClick={(e) => closeModal(e)}>
          <div className="newAdditionModalInner">
            <InvestmentAddStock
              currencyCodesFromDB={currencyCodesFromDB}
              setShowAddNewStockForm={setShowAddNewStockForm}
              refreshInvestmentsData={refreshInvestmentsData}
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Investments;
