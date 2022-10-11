import { motion } from "framer-motion";
import React, { Fragment, Key, useState } from "react";
import { FaEdit } from "react-icons/fa";
import getDisplayNumber from "../modules/getDisplayNumber";
import { CashAccountAccRowProps } from "../../../types/typeInterfaces";
import CashAccountUpdBal from "./CashAccountUpdBal";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { keyboardKey } from "@testing-library/user-event";

const CashAccountAccRow: React.FC<CashAccountAccRowProps> = ({
  data,
  updatedAllAccountBalances,
  settriggerRecalculations,
  triggerRecalculations,
  selectedCurrency,
}) => {
  const [styleForHoverDiv, setStyleForHoverDiv] = useState<object>({
    opacity: 0,
  });
  const [styleRowID, setstyleRowID] = useState<number>(-1);
  const [showEditAccountForm, setShowEditAccountForm] =
    useState<boolean>(false);

  const editThisAccount = () => {
    setShowEditAccountForm(true);
  };

  const enterKeyIsEdit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setShowEditAccountForm(true);
    }
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
        tabIndex={0}
        onKeyUp={(e) => enterKeyIsEdit(e)}
        onClick={(e) => editThisAccount()}
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
        <Tippy
          content={
            <span>
              Base currency value: {data.account_currency_code}{" "}
              {data.account_currency_symbol}
              {getDisplayNumber(data.account_balance)}
            </span>
          }
        >
          <div>
            {selectedCurrency.currency_symbol}{" "}
            {getDisplayNumber(data.accountBalConvertedValue)}
          </div>
        </Tippy>
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
