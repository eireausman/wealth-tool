import React from "react";
import getDisplayNumber from "../modules/getDisplayNumber";
import { OptionsBoardTotalDebtProps } from "../../../types/typeInterfaces";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FiInfo } from "react-icons/fi";
import Shimmer from "./Shimmer";

const OptionsBoardTotalDebt: React.FC<OptionsBoardTotalDebtProps> = ({
  totalDebtValue,
  selectedCurrencySymbol,
}) => {
  return (
    <button className="wealthContainerButton">
      <Tippy
        content={
          <span>
            Total Debt includes all assets that have a negative value. Loans and
            negative cash balances are included in this figure. Negatively
            priced investments are calcluated as zero.
          </span>
        }
      >
        <span className="spanReset">
          <FiInfo color="white" />
        </span>
      </Tippy>{" "}
      <b className="wealthFigureTitle">Total Debt </b>
      {totalDebtValue === undefined ? (
        <p className="wealthFigureShimmer">
          <Shimmer height={25} width={65} borderRadiusPX={5} />
        </p>
      ) : (
        <p
          className={
            totalDebtValue !== undefined && totalDebtValue < 0
              ? "wealthFigureNegative"
              : "wealthFigurePositive"
          }
        >
          {selectedCurrencySymbol}
          {totalDebtValue !== undefined && getDisplayNumber(totalDebtValue)}
        </p>
      )}
    </button>
  );
};

export default OptionsBoardTotalDebt;
