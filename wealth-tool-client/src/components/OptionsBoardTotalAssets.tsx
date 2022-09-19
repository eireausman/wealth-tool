import React from "react";
import getDisplayNumber from "../modules/getDisplayNumber";
import { OptionsBoardTotalAssetsProps } from "../../../types/typeInterfaces";

const OptionsBoardTotalAssets: React.FC<OptionsBoardTotalAssetsProps> = ({
  selectedCurrencySymbol,
  totalPosAssets,
}) => {
  return (
    <div className="totalAssetBox">
      <b>Total Assets</b>{" "}
      <span
        className={
          totalPosAssets < 0 ? "optionsBoardNegative" : "optionsBoardPositive"
        }
      >
        {selectedCurrencySymbol}
        {getDisplayNumber(totalPosAssets)}
      </span>
    </div>
  );
};

export default OptionsBoardTotalAssets;
