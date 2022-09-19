import React from "react";
import getDisplayNumber from "../modules/getDisplayNumber";
import { OptionsBoardNetWealthProps } from "../../../types/typeInterfaces";

const OptionsBoardNetWealth: React.FC<OptionsBoardNetWealthProps> = ({
  netWealthValue,
  selectedCurrencySymbol,
}) => {
  return (
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
  );
};

export default OptionsBoardNetWealth;
