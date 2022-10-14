import { motion } from "framer-motion";
import React, { Fragment, Key, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { CashAccountAccRowProps } from "../../../types/typeInterfaces";
import CashAccountUpdBal from "./CashAccountUpdBal";
import Shimmer from "./Shimmer";

const CashAccountAccRowUpdatingVals: React.FC<CashAccountAccRowProps> = ({
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
        className="cashAccountsTableDataGridRow"
        tabIndex={0}
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

        <div>
          <Shimmer height={"1em"} width={"70px"} borderRadiusPX={"1px"} />
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
              checkForEscapeKey={checkForEscapeKey}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CashAccountAccRowUpdatingVals;
