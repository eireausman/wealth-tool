import React, { Fragment } from "react";
import {
  currencyCodesAPIData,
  OptionsBoardCurrencySelectProps,
} from "../../../types/typeInterfaces";

const OptionsBoardCurrencySelect: React.FC<OptionsBoardCurrencySelectProps> = ({
  setCurrency,
  selectedCurrency,
  currencyCodesFromDB,
  windowWidth,
  wideWidthLimit,
}) => {
  return (
    <Fragment>
      {windowWidth > wideWidthLimit ? (
        <label htmlFor="Currency">
          Show values in:{" "}
          <select
            name="Currency"
            id="Currency"
            onChange={setCurrency}
            value={selectedCurrency}
            className="currencySelectElement"
          >
            {currencyCodesFromDB?.map((data) => (
              <option key={data.id} value={data.currency_code}>
                {data.currency_name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label htmlFor="Currency">
          <select
            name="Currency"
            id="Currency"
            onChange={setCurrency}
            value={selectedCurrency}
            className="currencySelectElement"
          >
            {currencyCodesFromDB?.map((data) => (
              <option key={data.id} value={data.currency_code}>
                {data.currency_code}
              </option>
            ))}
          </select>
        </label>
      )}
    </Fragment>
  );
};

export default OptionsBoardCurrencySelect;
