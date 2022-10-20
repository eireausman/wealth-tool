import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
  useContext,
} from "react";
import { CashAccountsProps } from "../../../types/typeInterfaces";
import "./CashAccounts.css";
import CardSpinner from "./CardSpinner";
import CashAccountAddAcc from "./CashAccountAddAcc";
import { cashAccountAPIData } from "../../../types/typeInterfaces";
import {
  getCashAccountData,
  getNetCashAccountTotal,
} from "../modules/serverRequests";
import { AxiosResponse } from "axios";
import CashAccountAccRow from "./CashAccountAccRow";
import NoAssets from "./NoAssetsMessage";
import { FaPiggyBank } from "react-icons/fa";
import ButtonAddAsset from "./ButtonAddAsset";
import ViewCardHeaderRow from "./ViewCardHeaderRow";
import CashAccountAccRowUpdatingVals from "./CashAccountAccRowUpdatingVals";
import ViewCardHeaderRowSorting from "./ViewCardHeaderRowSorting";
import { useAssetCountContext } from "../modules/Contexts";

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

  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [cashAccountNetTotal, setcashAccountNetTotal] = useState<
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

  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("account_nickname");
  const previousOrderBy = useRef(orderByThisColumn);
  const previousCurrency = useRef(selectedCurrency);
  const [cashAccAPIData, setcashAccAPIData] =
    useState<Array<cashAccountAPIData>>();

  const assetCount = useContext(useAssetCountContext);

  const updateNetCashAccountTotal = useCallback(async () => {
    if (previousOrderBy.current === orderByThisColumn) {
      setcashAccountNetTotal(undefined);
      const total = await getNetCashAccountTotal(
        selectedCurrency.currency_code
      );
      setcashAccountNetTotal(total);
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

  const getAllAccountBalances = useCallback(async () => {
    const cashAccServerDataRequest: AxiosResponse<any, any> | undefined =
      await getCashAccountData(
        selectedCurrency.currency_code,
        orderByThisColumn
      );
    if (
      cashAccServerDataRequest !== undefined &&
      cashAccServerDataRequest.status === 200 &&
      cashAccServerDataRequest.data !== undefined
    ) {
      setcashAccAPIData(cashAccServerDataRequest.data);
    }
  }, [selectedCurrency, orderByThisColumn]);

  const itemDetailUpdated = useCallback(
    (cashAccountID: number) => {
      setthisItemIdBeingEdited(cashAccountID);
      getAllAccountBalances().then(() => {
        setthisItemIdBeingEdited(0);
      });
    },
    [getAllAccountBalances]
  );

  useEffect(() => {
    getAllAccountBalances().then(() => {
      previousOrderBy.current = orderByThisColumn;
      previousCurrency.current = selectedCurrency;
    });
  }, [
    getAllAccountBalances,
    entryIDWasDeleted,
    itemIDWasAdded,
    selectedCurrency,
    orderByThisColumn,
  ]);

  useEffect(() => {
    updateNetCashAccountTotal();
  }, [updateNetCashAccountTotal, cashAccAPIData]);

  useEffect(() => {
    setShimmerState();
  }, [setShimmerState, cashAccAPIData, thisItemIdBeingEdited]);

  const showAddNewCashAccForm = () => {
    setshowAddNewForm(true);
  };

  const closeModal = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className === "newAdditionModal") {
      setshowAddNewForm(false);
    }
  };

  return (
    <section className="viewCard">
      {cashAccAPIData === undefined && assetCount.cashAccount > 0 && (
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
            clickFunction={showAddNewCashAccForm}
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
              addNewFunction={showAddNewCashAccForm}
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

          <section className="cashAccountsTable">
            <header className="cashAccountsTableHeader">
              <div className="table-header">A/c Name</div>
              <div className="table-header">Owner</div>
              <div className="table-header">Balance</div>
            </header>
            <section className="cashAccountsTableDataContainer scrollbarstyles">
              {cashAccAPIData?.map((data, index) => (
                <Fragment key={data.account_id}>
                  {shimmerTheseRows === data.account_id ||
                  shimmerTheseRows === "all" ? (
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
                      itemDetailUpdated={itemDetailUpdated}
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
