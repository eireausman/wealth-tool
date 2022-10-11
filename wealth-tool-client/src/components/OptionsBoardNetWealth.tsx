import React from "react";
import getDisplayNumber from "../modules/getDisplayNumber";
import { OptionsBoardNetWealthProps } from "../../../types/typeInterfaces";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FiInfo } from "react-icons/fi";
import Shimmer from "./Shimmer";

const OptionsBoardNetWealth: React.FC<OptionsBoardNetWealthProps> = ({
  netWealthValue,
  selectedCurrency,
  showInfo,
}) => {
  const tf = false;

  return (
    <button className="wealthContainerButton">
      {showInfo === true && (
        <Tippy content={<span>Total Assets minus Total Debt.</span>}>
          <span className="spanReset">
            <FiInfo color="white" />
          </span>
        </Tippy>
      )}
      <b className="wealthFigureTitle">Net Wealth</b>
      {netWealthValue === undefined ? (
        <p className="wealthFigureShimmer">
          <Shimmer height={25} width={96} borderRadiusPX={5} />
        </p>
      ) : (
        <p
          className={
            netWealthValue !== undefined && netWealthValue < 0
              ? "wealthFigureNegative"
              : "wealthFigurePositive"
          }
        >
          {selectedCurrency.currency_symbol}
          {netWealthValue !== undefined && getDisplayNumber(netWealthValue)}
        </p>
      )}
    </button>
  );
};

export default OptionsBoardNetWealth;
