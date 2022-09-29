import { motion } from "framer-motion";
import React, { Fragment, useState } from "react";
import { FaEdit } from "react-icons/fa";
import getDisplayNumber from "../modules/getDisplayNumber";
import { CashAccountAccRowProps } from "../../../types/typeInterfaces";
import CashAccountUpdBal from "./CashAccountUpdBal";

const CashAccountAccRow: React.FC<CashAccountAccRowProps> = ({
  data,
  selectedCurrencySymbol,
  updatedAllAccountBalances,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const [styleForHoverDiv, setStyleForHoverDiv] = useState<object>({
    opacity: 0,
  });
  const [styleRowID, setstyleRowID] = useState<number>(-1);
  const [showEditAccountForm, setShowEditAccountForm] =
    useState<boolean>(false);

  const editThisAccount = (account_id: number) => {
    setShowEditAccountForm(true);
  };

  const closeModal = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className === "newAdditionModal") {
      setShowEditAccountForm(false);
    }
  };

  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="cashAccountsTableDataGridRow"
        onClick={(e) => editThisAccount(data.account_id)}
        onMouseEnter={(e) => {
          setstyleRowID(data.account_id);
          setStyleForHoverDiv({ opacity: "1" });
        }}
        onMouseLeave={(e) => {
          setStyleForHoverDiv({ opacity: "0" });
          setstyleRowID(-1);
        }}
      >
        <div>
          {data.account_nickname.toUpperCase()}
          <FaEdit
            className="editValueIcon"
            color={"#087fed"}
            style={
              styleRowID === data.account_id
                ? styleForHoverDiv
                : { opacity: "0" }
            }
          />
        </div>
        <div>{data.account_owner_name.toUpperCase()}</div>
        <div>
          {" "}
          {data.account_currency_symbol}{" "}
          {getDisplayNumber(data.account_balance)}
        </div>
        <div>
          {" "}
          {selectedCurrencySymbol}{" "}
          {getDisplayNumber(data.accountBalConvertedValue)}
        </div>
      </motion.div>
      {showEditAccountForm === true && (
        <div className="newAdditionModal" onClick={(e) => closeModal(e)}>
          <div className="newAdditionModalInner">
            <CashAccountUpdBal
              data={data}
              setShowEditAccountForm={setShowEditAccountForm}
              updatedAllAccountBalances={updatedAllAccountBalances}
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CashAccountAccRow;
