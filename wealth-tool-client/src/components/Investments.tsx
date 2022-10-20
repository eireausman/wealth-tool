import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
  useContext,
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
import { useAssetCountContext } from "../modules/Contexts";

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
  const [entryIDWasDeleted, setentryIDWasDeleted] = useState<
    number | undefined
  >(undefined);
  const [itemIDWasAdded, setitemIDWasAdded] = useState<number | undefined>(
    undefined
  );
  const [thisItemIdBeingEdited, setthisItemIdBeingEdited] = useState<number>(0);
  const [shimmerTheseRows, setshimmerTheseRows] = useState<string | number>("");

  const previousOrderBy = useRef(orderByThisColumn);
  const previousCurrency = useRef(selectedCurrency);
  const assetCount = useContext(useAssetCountContext);

  const refreshInvestmentsDataFromDB = useCallback(async () => {
    if (previousOrderBy.current === orderByThisColumn) {
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
    }
  }, [selectedCurrency, orderByThisColumn]);

  const itemDetailUpdated = useCallback(
    (holdingID: number) => {
      setthisItemIdBeingEdited(holdingID);
      refreshInvestmentsDataFromDB().then(() => {
        setthisItemIdBeingEdited(0);
      });
    },
    [refreshInvestmentsDataFromDB]
  );

  const updateNetInvestmentTotal = useCallback(async () => {
    if (previousOrderBy.current === orderByThisColumn) {
      setInvestmentsTotalValue(undefined);
      const total = await getNetInvestmentTotal(selectedCurrency.currency_code);
      setInvestmentsTotalValue(total);
    }
  }, [selectedCurrency.currency_code, orderByThisColumn]);

  const setShimmerState = useCallback(() => {
    if (thisItemIdBeingEdited !== 0) {
      setshimmerTheseRows(thisItemIdBeingEdited);
    } else if (
      previousCurrency.current !== selectedCurrency &&
      previousOrderBy.current === orderByThisColumn
    ) {
      setshimmerTheseRows("all");
    } else {
      setshimmerTheseRows("");
    }
  }, [selectedCurrency, thisItemIdBeingEdited, orderByThisColumn]);

  useEffect(() => {
    refreshInvestmentsDataFromDB().then(() => {
      previousOrderBy.current = orderByThisColumn;
      previousCurrency.current = selectedCurrency;
    });
  }, [
    refreshInvestmentsDataFromDB,
    entryIDWasDeleted,
    itemIDWasAdded,
    selectedCurrency,
    orderByThisColumn,
  ]);

  useEffect(() => {
    updateNetInvestmentTotal();
  }, [updateNetInvestmentTotal, investmentAPIData]);

  useEffect(() => {
    setShimmerState();
  }, [setShimmerState, investmentAPIData, thisItemIdBeingEdited]);

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
      {investmentAPIData === undefined && assetCount.investments > 0 && (
        <CardSpinner cardTitle="Investments" />
      )}
      {assetCount.investments <= 0 && (
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
      {investmentAPIData !== undefined && assetCount.investments > 0 && (
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
                  {shimmerTheseRows === data.holding_id ||
                  shimmerTheseRows === "all" ? (
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
                      itemDetailUpdated={itemDetailUpdated}
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
