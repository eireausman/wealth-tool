import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
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
  const [showNoAccountsMessage, setshowNoAccountsMessage] = useState(false);
  const [cashAccountNetTotal, setcashAccountNetTotal] = useState<
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

  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("account_nickname");
  const previousOrderBy = useRef(orderByThisColumn);

  const [cashAccAPIData, setcashAccAPIData] =
    useState<Array<cashAccountAPIData>>();

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
    previousOrderBy.current = orderByThisColumn;
    setthisItemIdBeingEdited(-1);
  }, [selectedCurrency.currency_code, orderByThisColumn]);

  const updateNetCashAccountTotal = useCallback(async () => {
    setcashAccountNetTotal(undefined);
    const total = await getNetCashAccountTotal(selectedCurrency.currency_code);
    setcashAccountNetTotal(total);
  }, [selectedCurrency.currency_code]);

  useEffect(() => {
    getAllAccountBalances();
    updateNetCashAccountTotal();
  }, [
    getAllAccountBalances,
    updateNetCashAccountTotal,
    entryIDWasDeleted,
    itemIDWasAdded,
    thisItemIdBeingEdited,
  ]);

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
      {cashAccAPIData === undefined && showNoAccountsMessage === false && (
        <CardSpinner cardTitle="Cash Accounts" />
      )}
      {showNoAccountsMessage === true && (
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
      {cashAccAPIData !== undefined && showNoAccountsMessage === false && (
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
                  {data.account_id === thisItemIdBeingEdited &&
                  previousOrderBy.current === orderByThisColumn ? (
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
