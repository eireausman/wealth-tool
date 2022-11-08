import React, {
  useState,
  Fragment,
  useRef,
  useContext,
  useEffect,
} from "react";
import { InvestmentsProps } from "../../../../types/typeInterfaces";
import CardSpinner from "../loaders/CardSpinner";
import styles from "./Investments.module.css";
import InvestmentAddStock from "./InvestmentAddStock";
import InvestmentRow from "./InvestmentRow";
import NoAssets from "../viewCard/NoAssetsMessage";
import ButtonAddAsset from "../buttons/ButtonAddAsset";
import { GoGraph } from "react-icons/go";
import ViewCardHeaderRow from "../viewCard/ViewCardHeaderRow";
import InvestmentRowUpdatingPrices from "./InvestmentRowUpdatingPrices";
import ViewCardHeaderRowSorting from "../viewCard/ViewCardHeaderRowSorting";
import { useAssetCountContext } from "../../modules/Contexts";
import useRefreshInvestData from "./hooks/useRefreshInvestData";
import useUpdateNetInvestTotal from "./hooks/useUpdateNetInvestTotal";

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

  // useState
  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("holding_stock_name");
  const [showAddNewStockForm, setShowAddNewStockForm] =
    useState<boolean>(false);
  const [entryIDWasDeleted, setentryIDWasDeleted] = useState<
    number | undefined
  >(undefined);
  const [itemIDWasAdded, setitemIDWasAdded] = useState<number | undefined>(
    undefined
  );
  const [thisItemIdBeingEdited, setthisItemIdBeingEdited] = useState<number>(0);
  const [shimmerAllRows, setshimmerAllRows] = useState(false);

  // useRef
  const previousOrderBy = useRef(orderByThisColumn);
  const previousCurrency = useRef(selectedCurrency.currency_code);

  // useContext
  const assetCount = useContext(useAssetCountContext);

  // Hooks

  const investmentAPIData = useRefreshInvestData({
    thisItemIdBeingEdited,
    selectedCurrencyCode: selectedCurrency.currency_code,
    orderByThisColumn,
    entryIDWasDeleted,
    itemIDWasAdded,
  });

  const investmentsTotalValue = useUpdateNetInvestTotal({
    selectedCurrencyCode: selectedCurrency.currency_code,
    previousOrderBy: previousOrderBy.current,
    orderByThisColumn,
    entryIDWasDeleted,
    itemIDWasAdded,
    thisItemIdBeingEdited,
    investmentAPIData,
  });

  // useEffect
  useEffect(() => {
    if (
      previousCurrency.current !== selectedCurrency.currency_code &&
      previousOrderBy.current === orderByThisColumn
    ) {
      setshimmerAllRows(true);
    }
    previousCurrency.current = selectedCurrency.currency_code;
    previousOrderBy.current = orderByThisColumn;
  }, [orderByThisColumn, selectedCurrency.currency_code]);

  useEffect(() => {
    // set edit account to 0 to avoid shimmer being left 'on' for single record.
    setthisItemIdBeingEdited(0);
    setshimmerAllRows(false);
  }, [investmentAPIData]);

  // functions
  const closeModal = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className === "newAdditionModal") {
      setShowAddNewStockForm(false);
    }
  };

  return (
    <section className="viewCard">
      {assetCount.investments === undefined && (
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
            clickFunction={() => setShowAddNewStockForm(true)}
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
              addNewFunction={setShowAddNewStockForm}
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

          <section className={styles.investmentsTable}>
            <header className={styles.investmentsTableHeader}>
              <div className={styles.tableHeader}>Holding</div>
              <div
                className={`${styles.tableHeader} ${styles.columnInWideViewOnly}`}
              >
                Owner
              </div>
              <div
                className={`${styles.tableHeader} ${styles.columnInWideViewOnly}`}
              >
                Held at
              </div>
              <div
                className={`${styles.tableHeader} ${styles.columnInWideViewOnly}`}
              >
                Currency
              </div>
              <div className="table-header">Quantity</div>
              <div
                className={`${styles.tableHeader} ${styles.columnInWideViewOnly}`}
              >
                Price
              </div>
              <div
                className={`${styles.tableHeader} ${styles.columnInWideViewOnly}`}
              >
                Cost
              </div>
              <div className={styles.tableHeader}>Value</div>
            </header>
            <section
              className={`${styles.investmentsTableDataContainer} scrollbarstyles`}
            >
              {investmentAPIData?.map((data, index) => (
                <Fragment key={data.holding_id}>
                  {thisItemIdBeingEdited === data.holding_id ||
                  shimmerAllRows === true ? (
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
