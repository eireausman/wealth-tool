import React, { Fragment } from "react";
import { OptionsBoardCurrencySelectProps } from "../../../types/typeInterfaces";

const OptionsBoardCurrencySelect: React.FC<OptionsBoardCurrencySelectProps> = ({
  setCurrency,
  selectedCurrency,
  currencyCodesFromDB,
  windowWidth,
  wideWidthLimit,
}) => {
  if (currencyCodesFromDB === undefined) {
    return null;
  }
  return (
    <Fragment>
      {windowWidth > wideWidthLimit ? (
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
                Values in {data.currency_name}
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
                Show in {data.currency_code}
              </option>
            ))}
          </select>
        </label>
      )}
    </Fragment>
  );
};

export default OptionsBoardCurrencySelect;
