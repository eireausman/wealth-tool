import React from "react";
import { InvestmentsUpdateStockProps } from "../../../types/typeInterfaces";

const InvestmentsUpdateStock: React.FC<InvestmentsUpdateStockProps> = ({
  data,
  setshowEditStockForm,
  refreshInvestmentsData,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  return <div className="viewCardRow">InvestmentsUpdateStock</div>;
};

export default InvestmentsUpdateStock;
