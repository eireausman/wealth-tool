import React from "react";
import getDisplayNumber from "../../modules/getDisplayNumber";
import { OptionsBoardTotalAssetsProps } from "../../../../types/typeInterfaces";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FiInfo } from "react-icons/fi";
import Shimmer from "../loaders/Shimmer";
import styles from "./OptionsBoardWealthFigure.module.css";

const OptionsBoardTotalAssets: React.FC<OptionsBoardTotalAssetsProps> = ({
  selectedCurrencySymbol,
  totalPosAssets,
}) => {
  return (
    <button className={styles.wealthContainerButton}>
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
      <b className={styles.wealthFigureTitle}>Total Assets</b>{" "}
      {totalPosAssets === undefined ? (
        <div className={styles.wealthFigureShimmer}>
          <Shimmer height={"1.5em"} width={"96px"} borderRadiusPX={"5px"} />
        </div>
      ) : (
        <p
          className={
            totalPosAssets !== undefined && totalPosAssets < 0
              ? styles.wealthFigureNegative
              : styles.wealthFigurePositive
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
