import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
  useContext,
} from "react";
import { CashAccountsProps } from "../../../../types/typeInterfaces";
import styles from "./CashAccounts.module.css";
import CardSpinner from "../loaders/CardSpinner";
import CashAccountAddAcc from "./CashAccountAddAcc";
import CashAccountAccRow from "./CashAccountAccRow";
import NoAssets from "../viewCard/NoAssetsMessage";
import { FaPiggyBank } from "react-icons/fa";
import ButtonAddAsset from "../buttons/ButtonAddAsset";
import ViewCardHeaderRow from "../viewCard/ViewCardHeaderRow";
import CashAccountAccRowUpdatingVals from "./CashAccountAccRowUpdatingVals";
import ViewCardHeaderRowSorting from "../viewCard/ViewCardHeaderRowSorting";
import { useAssetCountContext } from "../../modules/Contexts";
import useGetCashAccountBalances from "./hooks/useGetCashAccountBalances";
import useUpdateNetCashAccTotal from "./hooks/useUpdateNetCashAccTotal";

const CashAccounts: React.FC<CashAccountsProps> = ({
  triggerRecalculations,
  settriggerRecalculations,
  selectedCurrency,
}) => {
  const sortArray = [
    { readableString: "A/c Name", dbField: "account_nickname" },
    { readableString: "Owner", dbField: "account_owner_name" },
    { readableString: "Balance", dbField: "account_balance" },
  ];

  // useState
  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [entryIDWasDeleted, setentryIDWasDeleted] = useState<
    number | undefined
  >(undefined);
  const [itemIDWasAdded, setitemIDWasAdded] = useState<number | undefined>(
    undefined
  );
  const [thisItemIdBeingEdited, setthisItemIdBeingEdited] = useState<number>(0);
  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("account_nickname");
  const [shimmerAllRows, setshimmerAllRows] = useState(false);

  // useRef
  const previousOrderBy = useRef(orderByThisColumn);
  const previousCurrency = useRef(selectedCurrency.currency_code);

  // useContext
  const assetCount = useContext(useAssetCountContext);

  // Hooks
  const cashAccAPIData = useGetCashAccountBalances({
    thisItemIdBeingEdited,
    selectedCurrencyCode: selectedCurrency.currency_code,
    orderByThisColumn,
    entryIDWasDeleted,
    itemIDWasAdded,
  });

  const cashAccountNetTotal = useUpdateNetCashAccTotal({
    selectedCurrencyCode: selectedCurrency.currency_code,
    previousOrderBy: previousOrderBy.current,
    orderByThisColumn,
    entryIDWasDeleted,
    itemIDWasAdded,
    thisItemIdBeingEdited,
    cashAccAPIData,
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
  }, [cashAccAPIData]);

  // Functions
  const closeModal = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className.includes("newAdditionModal")) {
      setshowAddNewForm(false);
    }
  };

  return (
    <section className="viewCard">
      {assetCount.cashAccounts === undefined && (
        <CardSpinner cardTitle="Cash Accounts" />
      )}
      {assetCount.cashAccounts <= 0 && (
        <Fragment>
          <NoAssets
            cardTitle="Cash Accounts"
            cardText="No accounts being tracked"
            assetType="cashAccount"
          />
          <ButtonAddAsset
            clickFunction={() => setshowAddNewForm(true)}
            buttonTextContent="Add Account"
          />
        </Fragment>
      )}
      {cashAccAPIData !== undefined && assetCount.cashAccounts > 0 && (
        <Fragment>
          {previousOrderBy.current === orderByThisColumn ? (
            <ViewCardHeaderRow
              rowIcon={<FaPiggyBank size={25} color={"white"} />}
              rowTitle="CASH ACCOUNTS"
              netTotal={cashAccountNetTotal}
              selectedCurrency={selectedCurrency}
              addNewFunction={setshowAddNewForm}
              sortArray={sortArray}
              orderByThisColumn={orderByThisColumn}
              setorderByThisColumn={setorderByThisColumn}
            />
          ) : (
            <ViewCardHeaderRowSorting
              rowIcon={<FaPiggyBank size={25} color={"white"} />}
              rowTitle="CASH ACCOUNTS"
            />
          )}

          <section className={styles.cashAccountsTable}>
            <header className={styles.cashAccountsTableHeader}>
              <div className={styles.tableHeader}>A/c Name</div>
              <div className={styles.tableHeader}>Owner</div>
              <div className={styles.tableHeader}>Balance</div>
            </header>
            <section
              className={`${styles.cashAccountsTableDataContainer} scrollbarstyles`}
            >
              {cashAccAPIData?.map((data, index) => (
                <Fragment key={data.account_id}>
                  {thisItemIdBeingEdited === data.account_id ||
                  shimmerAllRows === true ? (
                    <CashAccountAccRowUpdatingVals
                      key={data.account_id}
                      data={data}
                    />
                  ) : (
                    <CashAccountAccRow
                      key={data.account_id}
                      data={data}
                      settriggerRecalculations={settriggerRecalculations}
                      triggerRecalculations={triggerRecalculations}
                      selectedCurrency={selectedCurrency}
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

      {showAddNewForm === true && (
        <div className="newAdditionModal" onClick={(e) => closeModal(e)}>
          <div className="newAdditionModalInner">
            <CashAccountAddAcc
              setshowAddNewForm={setshowAddNewForm}
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

export default CashAccounts;
