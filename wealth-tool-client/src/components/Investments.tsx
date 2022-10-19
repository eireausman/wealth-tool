import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
} from "react";
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
import InvestmentRowUpdatingPrices from "./InvestmentRowUpdatingPrices";
import ViewCardHeaderRowSorting from "./ViewCardHeaderRowSorting";

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
  const previousOrderBy = useRef(orderByThisColumn);

  const [showAddNewStockForm, setShowAddNewStockForm] =
    useState<boolean>(false);
  const [investmentAPIData, setinvestmentAPIData] =
    useState<Array<investmentsAPIData>>();
  const [investmentsTotalValue, setInvestmentsTotalValue] = useState<
    number | undefined
  >(0);
  const [entryIDWasDeleted, setentryIDWasDeleted] = useState<
    number | undefined
  >(undefined);
  const [itemIDWasAdded, setitemIDWasAdded] = useState<number | undefined>(
    undefined
  );
  const [thisItemIdBeingEdited, setthisItemIdBeingEdited] =
    useState<number>(-1);

  const refreshInvestmentsDataFromDB = useCallback(async () => {
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
    }
    previousOrderBy.current = orderByThisColumn;
    setthisItemIdBeingEdited(-1);
  }, [selectedCurrency.currency_code, orderByThisColumn]);

  const updateNetInvestmentTotal = useCallback(async () => {
    setInvestmentsTotalValue(undefined);
    const total = await getNetInvestmentTotal(selectedCurrency.currency_code);
    setInvestmentsTotalValue(total);
  }, [selectedCurrency.currency_code]);

  useEffect(() => {
    refreshInvestmentsDataFromDB();
    updateNetInvestmentTotal();
  }, [
    refreshInvestmentsDataFromDB,
    updateNetInvestmentTotal,
    entryIDWasDeleted,
    itemIDWasAdded,
    thisItemIdBeingEdited,
  ]);

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
          {previousOrderBy.current === orderByThisColumn ? (
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
          ) : (
            <ViewCardHeaderRowSorting
              rowIcon={<GoGraph size={25} color={"white"} />}
              rowTitle="INVESTMENTS"
            />
          )}

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
                <Fragment key={data.holding_id}>
                  {data.holding_id === thisItemIdBeingEdited &&
                  previousOrderBy.current === orderByThisColumn ? (
                    <InvestmentRowUpdatingPrices
                      key={data.holding_id}
                      data={data}
                    />
                  ) : (
                    <InvestmentRow
                      key={data.holding_id}
                      data={data}
                      selectedCurrency={selectedCurrency}
                      settriggerRecalculations={settriggerRecalculations}
                      triggerRecalculations={triggerRecalculations}
                      setentryIDWasDeleted={setentryIDWasDeleted}
                      setthisItemIdBeingEdited={setthisItemIdBeingEdited}
                    />
                  )}
                </Fragment>
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
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
              setitemIDWasAdded={setitemIDWasAdded}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Investments;
