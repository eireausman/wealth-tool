import React from "react";
import getDisplayNumber from "../modules/getDisplayNumber";
import { OptionsBoardTotalAssetsProps } from "../../../types/typeInterfaces";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const OptionsBoardTotalAssets: React.FC<OptionsBoardTotalAssetsProps> = ({
  selectedCurrencySymbol,
  totalPosAssets,
}) => {
  return (
    <Tippy
      content={
        <span>
          Total Assets includes all assets that have a positive value. Negative
          assets (e.g. loans) are not included in this figure.
        </span>
      }
    >
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
    </Tippy>
  );
};

export default OptionsBoardTotalAssets;
