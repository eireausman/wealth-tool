import React from "react";
import getDisplayNumber from "../modules/getDisplayNumber";
import { OptionsBoardTotalDebtProps } from "../../../types/typeInterfaces";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const OptionsBoardTotalDebt: React.FC<OptionsBoardTotalDebtProps> = ({
  totalDebtValue,
  selectedCurrencySymbol,
}) => {
  return (
    <Tippy
      content={
        <span>
          Total Debt includes all assets that have a negative value. Loans and
          negative cash balances are included in this figure. Negatively priced
          investments are calcluated as zero.
        </span>
      }
    >
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
    </Tippy>
  );
};

export default OptionsBoardTotalDebt;
