import { motion } from "framer-motion";
import React, { Fragment, useState } from "react";
import { FaEdit } from "react-icons/fa";
import getDisplayNumber from "../../modules/getDisplayNumber";
import { CashAccountAccRowProps } from "../../../../types/typeInterfaces";
import CashAccountUpdBal from "./CashAccountUpdBal";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import styles from "./CashAccountAccRow.module.css";

const CashAccountAccRow: React.FC<CashAccountAccRowProps> = ({
  data,
  settriggerRecalculations,
  triggerRecalculations,
  selectedCurrency,
  setentryIDWasDeleted,
  setthisItemIdBeingEdited,
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

  const checkKeyEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setShowEditAccountForm(true);
    }
  };

  const checkForEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowEditAccountForm(false);
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
        className={styles.cashAccountsTableDataGridRow}
        tabIndex={0}
        data-testid="editThisAccountDiv"
        onKeyUp={(e) => checkKeyEnter(e)}
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
        <div
          className="newAdditionModal"
          data-testid="newAdditionModal"
          onClick={(e) => closeModal(e)}
          onKeyUp={(e) => checkForEscapeKey(e)}
        >
          <div className="newAdditionModalInner">
            <CashAccountUpdBal
              data={data}
              setShowEditAccountForm={setShowEditAccountForm}
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
              checkForEscapeKey={checkForEscapeKey}
              setentryIDWasDeleted={setentryIDWasDeleted}
              setthisItemIdBeingEdited={setthisItemIdBeingEdited}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CashAccountAccRow;
