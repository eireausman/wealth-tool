import React from "react";
import getDisplayNumber from "../modules/getDisplayNumber";
import { OptionsBoardNetWealthProps } from "../../../types/typeInterfaces";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const OptionsBoardNetWealth: React.FC<OptionsBoardNetWealthProps> = ({
  netWealthValue,
  selectedCurrencySymbol,
}) => {
  return (
    <Tippy content={<span>Total Assets minus Total Debt.</span>}>
      <div className="totalAssetBox">
        <b>Net Wealth</b>{" "}
        <span
          className={
            netWealthValue < 0 ? "optionsBoardNegative" : "optionsBoardPositive"
          }
        >
          {selectedCurrencySymbol}
          {getDisplayNumber(netWealthValue)}
        </span>
      </div>
    </Tippy>
  );
};

export default OptionsBoardNetWealth;
