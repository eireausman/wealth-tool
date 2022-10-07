import React, { Fragment } from "react";
import { investmentsAPIData } from "../../../types/typeInterfaces";
import getDisplayNumber from "../modules/getDisplayNumber";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { TbCircleDashed } from "react-icons/tb";
import InvestmentsPriceChart from "./InvestmentsPriceChart";

interface InvestmentRowPriceProps {
  data: investmentsAPIData;
}

const InvestmentRowPrice: React.FC<InvestmentRowPriceProps> = ({ data }) => {
  return (
    <Fragment>
      {data.investment_price_histories[0].holding_current_price === "0" ? (
        <Tippy
          content={
            <span>
              The price for this stock is not obtainable. The price feed may be
              unavailable or the stock may be unlisted/suspended.
            </span>
          }
        >
          <div>
            <TbCircleDashed />
          </div>
        </Tippy>
      ) : (
        <Tippy
          content={
            <span>
              {parseFloat(
                (
                  parseFloat(
                    data.investment_price_histories[0].holding_current_price
                  ) / 100
                ).toFixed(6)
              ).toPrecision()}{" "}
              (price without rounding)
            </span>
          }
        >
          <div>
            {getDisplayNumber(
              parseFloat(
                data.investment_price_histories[0].holding_current_price
              ) / 100
            )}
          </div>
        </Tippy>
      )}
    </Fragment>
  );
};

export default InvestmentRowPrice;
