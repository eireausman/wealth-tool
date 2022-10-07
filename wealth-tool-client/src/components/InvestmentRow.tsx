import React, { useState, Fragment } from "react";
import { InvestmentRowProps } from "../../../types/typeInterfaces";
import { FaEdit } from "react-icons/fa";
import getDisplayNumber from "../modules/getDisplayNumber";
import InvestmentsUpdateStock from "./InvestmentsUpdateStock";
import { motion } from "framer-motion";
import InvestmentRowPrice from "./InvestmentRowPrice";
import InvestmentsPriceChart from "./InvestmentsPriceChart";

const InvestmentRow: React.FC<InvestmentRowProps> = ({
  data,
  selectedCurrency,
  refreshInvestmentsData,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const [styleForHoverDiv, setStyleForHoverDiv] = useState<object>({
    opacity: 0,
  });
  const [styleRowID, setstyleRowID] = useState<number>(-1);
  const [showEditStockForm, setshowEditStockForm] = useState(false);

  const closeModal = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className === "newAdditionModal") {
      setshowEditStockForm(false);
    }
  };

  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="investmentsTableDataGridRow"
        onClick={() => setshowEditStockForm(true)}
        onMouseEnter={(e) => {
          setstyleRowID(data.holding_id);
          setStyleForHoverDiv({ opacity: "1" });
        }}
        onMouseLeave={(e) => {
          setStyleForHoverDiv({ opacity: "0" });
          setstyleRowID(-1);
        }}
      >
        <div>
          {data.holding_stock_name}
          <FaEdit
            className="editValueIcon"
            color={"#087fed"}
            style={
              styleRowID === data.holding_id
                ? styleForHoverDiv
                : { opacity: "0" }
            }
          />
        </div>
        <InvestmentsPriceChart data={data} />
        <div className="columnInWideViewOnly">{data.holding_owner_name}</div>
        <div className="columnInWideViewOnly"> {data.holding_institution}</div>
        <div className="columnInWideViewOnly">
          {" "}
          {data.holding_currency_code}
        </div>
        <div>{getDisplayNumber(data.holding_quantity_held)}</div>
        <div className="columnInWideViewOnly">
          <InvestmentRowPrice data={data} />
        </div>

        <div className="columnInWideViewOnly">
          {" "}
          {data.holding_cost_total_value}
        </div>
        <div>
          {selectedCurrency.currency_symbol}{" "}
          {getDisplayNumber(data.investmentConvertedValue)}
        </div>
      </motion.div>
      {showEditStockForm === true && (
        <div className="newAdditionModal" onClick={(e) => closeModal(e)}>
          <div className="newAdditionModalInner">
            <InvestmentsUpdateStock
              data={data}
              setshowEditStockForm={setshowEditStockForm}
              refreshInvestmentsData={refreshInvestmentsData}
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default InvestmentRow;
