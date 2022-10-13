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
  getSingleInvestmentData,
} from "../modules/serverRequests";
import NoAssets from "./NoAssetsMessage";
import { AxiosResponse } from "axios";
import ButtonAddAsset from "./ButtonAddAsset";
import { GoGraph } from "react-icons/go";
import ViewCardHeaderRow from "./ViewCardHeaderRow";
import InvestmentRowUpdatingPrices from "./InvestmentRowUpdatingPrices";

const Investments: React.FC<InvestmentsProps> = ({
  triggerRecalculations,
  settriggerRecalculations,
  selectedCurrency,
}) => {
  const sortArray = [
    { readableString: "Stock Name", dbField: "holding_stock_name" },
    { readableString: "Held at", dbField: "holding_institution" },
    { readableString: "Cost", dbField: "holding_cost_total_value" },
    { readableString: "Currency", dbField: "holding_currency_code" },
  ];

  const [showNoAccountsMessage, setshowNoAccountsMessage] = useState(false);
  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("holding_stock_name");

  const [showAddNewStockForm, setShowAddNewStockForm] =
    useState<boolean>(false);
  const [investmentAPIData, setinvestmentAPIData] =
    useState<Array<investmentsAPIData>>();
  const [investmentsTotalValue, setInvestmentsTotalValue] = useState<
    number | undefined
  >(0);

  const refreshInvestmentsData = async (holdingID?: number) => {
    setshowNoAccountsMessage(false);
    setInvestmentsTotalValue(undefined);

    if (holdingID !== undefined && investmentAPIData !== undefined) {
      const investmentAPIDataCopy = [...investmentAPIData];
      // if we are only updating a single record:
      for (let item in investmentAPIDataCopy) {
        if (investmentAPIDataCopy[item].holding_id === holdingID) {
          investmentAPIDataCopy[
            item
          ].investment_price_histories[0].holding_current_price =
            "priceReloading";

          setinvestmentAPIData(investmentAPIDataCopy);

          const newPriceData = await getSingleInvestmentData(
            selectedCurrency.currency_code,
            holdingID
          );
          if (newPriceData) {
            if (newPriceData.data[0].holding_id === holdingID) {
              investmentAPIDataCopy[item] = newPriceData.data[0];
            }
            setinvestmentAPIData(investmentAPIDataCopy);
          }
          break;
        }
      }
    } else {
      if (investmentAPIData !== undefined) {
        const investmentAPIDataCopy = [...investmentAPIData];
        investmentAPIDataCopy.forEach((item) => {
          item.investment_price_histories[0].holding_current_price =
            "priceReloading";
        });
        setinvestmentAPIData(investmentAPIDataCopy);
      }
      const investData: AxiosResponse<any, any> | undefined =
        await getInvestmentData(
          selectedCurrency.currency_code,
          orderByThisColumn
        );

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
    }

    const total = await getNetInvestmentTotal(selectedCurrency.currency_code);
    setInvestmentsTotalValue(total);
  };

  //reload API data if currency changes:
  useEffect(() => {
    refreshInvestmentsData();
  }, [selectedCurrency.currency_code, orderByThisColumn]);

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
      {investmentAPIData === undefined && showNoAccountsMessage === false && (
        <CardSpinner cardTitle="Investments" />
      )}
      {showNoAccountsMessage === true && (
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
      {investmentAPIData !== undefined && showNoAccountsMessage === false && (
        <Fragment>
          <ViewCardHeaderRow
            rowIcon={<GoGraph size={25} color={"white"} />}
            rowTitle="INVESTMENTS"
            selectedCurrency={selectedCurrency}
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
              <div className="table-header columnInWideViewOnly">Currency</div>
              <div className="table-header">Quantity</div>
              <div className="table-header columnInWideViewOnly">Price</div>
              <div className="table-header columnInWideViewOnly">Cost</div>
              <div className="table-header">Value</div>
            </header>
            <section className="investmentsTableDataContainer scrollbarstyles">
              {investmentAPIData?.map((data, index) => (
                <>
                  {data.investment_price_histories[0].holding_current_price ===
                  "priceReloading" ? (
                    <InvestmentRowUpdatingPrices
                      key={data.holding_id}
                      data={data}
                    />
                  ) : (
                    <InvestmentRow
                      key={data.holding_id}
                      data={data}
                      selectedCurrency={selectedCurrency}
                      refreshInvestmentsData={refreshInvestmentsData}
                      settriggerRecalculations={settriggerRecalculations}
                      triggerRecalculations={triggerRecalculations}
                    />
                  )}
                </>
              ))}
            </section>
          </section>
        </Fragment>
      )}

      {showAddNewStockForm === true && (
        <div className="newAdditionModal" onClick={(e) => closeModal(e)}>
          <div className="newAdditionModalInner">
            <InvestmentAddStock
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
