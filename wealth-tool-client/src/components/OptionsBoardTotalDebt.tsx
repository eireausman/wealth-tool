import React from "react";
import getDisplayNumber from "../modules/getDisplayNumber";
import { OptionsBoardTotalDebtProps } from "../../../types/typeInterfaces";

const OptionsBoardTotalDebt: React.FC<OptionsBoardTotalDebtProps> = ({
  totalDebtValue,
  selectedCurrencySymbol,
}) => {
  return (
    <div className="totalAssetBox">
      <b>Total Debt </b>
      <span
        className={
          totalDebtValue < 0 ? "optionsBoardNegative" : "optionsBoardPositive"
        }
      >
        {selectedCurrencySymbol}
        {getDisplayNumber(totalDebtValue)}
      </span>
    </div>
  );
};

export default OptionsBoardTotalDebt;
