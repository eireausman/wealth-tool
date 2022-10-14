import React from "react";
import getDisplayNumber from "../modules/getDisplayNumber";
import { OptionsBoardTotalAssetsProps } from "../../../types/typeInterfaces";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FiInfo } from "react-icons/fi";
import Shimmer from "./Shimmer";

const OptionsBoardTotalAssets: React.FC<OptionsBoardTotalAssetsProps> = ({
  selectedCurrencySymbol,
  totalPosAssets,
}) => {
  return (
    <button className="wealthContainerButton">
      <Tippy
        content={
          <span>
            Total Assets includes all assets that have a positive value.
            Negative assets (e.g. loans) are not included in this figure.
          </span>
        }
      >
        <span className="spanReset">
          <FiInfo color="white" />
        </span>
      </Tippy>
      <b className="wealthFigureTitle">Total Assets</b>{" "}
      {totalPosAssets === undefined ? (
        <div className="wealthFigureShimmer">
          <Shimmer height={"1em"} width={"96px"} borderRadiusPX={"5px"} />
        </div>
      ) : (
        <p
          className={
            totalPosAssets !== undefined && totalPosAssets < 0
              ? "wealthFigureNegative"
              : "wealthFigurePositive"
          }
        >
          {selectedCurrencySymbol}
          {totalPosAssets !== undefined && getDisplayNumber(totalPosAssets)}
        </p>
      )}
    </button>
  );
};

export default OptionsBoardTotalAssets;
