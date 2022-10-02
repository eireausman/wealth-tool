import React, { useState, useEffect, Fragment } from "react";
import { InvestmentsProps } from "../../../types/typeInterfaces";
import CardSpinner from "./CardSpinner";
import "./Investments.css";
import InvestmentAddStock from "./InvestmentAddStock";
import InvestmentRow from "./InvestmentRow";
import { investmentsAPIData } from "../../../types/typeInterfaces";
import {
  getInvestmentData,
  getNetInvestmentTotal,
} from "../modules/serverRequests";
import NoAssets from "./NoAssetsMessage";
import { AxiosResponse } from "axios";
import ButtonAddAsset from "./ButtonAddAsset";
import { GoGraph } from "react-icons/go";
import ViewCardHeaderRow from "./ViewCardHeaderRow";

const Investments: React.FC<InvestmentsProps> = ({
  selectedCurrencyCode,
  selectedCurrencySymbol,
  currencyCodesFromDB,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const sortArray = [
    { readableString: "Stock Name", dbField: "holding_stock_name" },
    { readableString: "Held at", dbField: "holding_institution" },
    { readableString: "Cost", dbField: "holding_cost_total_value" },
    { readableString: "Currency", dbField: "holding_currency_code" },
  ];

  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [showNoAccountsMessage, setshowNoAccountsMessage] = useState(false);
  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("holding_stock_name");

  const [showAddNewStockForm, setShowAddNewStockForm] =
    useState<boolean>(false);
  const [investmentAPIData, setinvestmentAPIData] =
    useState<Array<investmentsAPIData>>();
  const [investmentsTotalValue, setInvestmentsTotalValue] = useState<number>(0);

  const refreshInvestmentsData = async () => {
    setShowSpinner(true);
    setshowNoAccountsMessage(false);
    setinvestmentAPIData(undefined);

    const investData: AxiosResponse<any, any> | undefined =
      await getInvestmentData(selectedCurrencyCode, orderByThisColumn);

    if (
      investData !== undefined &&
      investData.status === 200 &&
      investData.data !== undefined
    ) {
      setinvestmentAPIData(investData.data);
      setshowNoAccountsMessage(false);
      setShowSpinner(false);
    } else if (investData !== undefined && investData.status === 204) {
      setShowSpinner(false);
      setshowNoAccountsMessage(true);
    }

    const total = await getNetInvestmentTotal(selectedCurrencyCode);
    setInvestmentsTotalValue(total);
  };

  //reload API data if currency changes:
  useEffect(() => {
    refreshInvestmentsData();
  }, [selectedCurrencyCode, orderByThisColumn]);

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
      {showSpinner === true && showNoAccountsMessage === false && (
        <CardSpinner cardTitle="Investments" />
      )}
      {showSpinner === false && showNoAccountsMessage === true && (
        <Fragment>
          <NoAssets
            cardTitle="Investments"
            cardText="No investments being tracked"
            assetType="investment"
          />
          <ButtonAddAsset
            clickFunction={addANewStock}
            buttonTextContent="Add Stock"
          />
        </Fragment>
      )}
      {investmentAPIData !== undefined &&
        showSpinner === false &&
        showNoAccountsMessage === false && (
          <Fragment>
            <ViewCardHeaderRow
              rowIcon={<GoGraph size={25} color={"white"} />}
              rowTitle="INVESTMENTS"
              selectedCurrencySymbol={selectedCurrencySymbol}
              netTotal={investmentsTotalValue}
              addNewFunction={addANewStock}
              sortArray={sortArray}
              orderByThisColumn={orderByThisColumn}
              setorderByThisColumn={setorderByThisColumn}
            />

            <section className="investmentsTable">
              <header className="investmentsTableHeader">
                <div className="table-header">Holding</div>
                <div className="table-header columnInWideViewOnly">Owner</div>
                <div className="table-header columnInWideViewOnly">Held at</div>
                <div className="table-header columnInWideViewOnly">
                  Currency
                </div>
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
