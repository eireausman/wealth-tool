import { motion } from "framer-motion";
import React, { Fragment, useContext, useState } from "react";
import { OptionsBoardCurrencySelectProps } from "../../../types/typeInterfaces";
import "./OptionsBoardCurrencySelect.css";
import { useCurrenciesFromDBContext } from "../modules/Contexts";

const OptionsBoardCurrencySelect: React.FC<OptionsBoardCurrencySelectProps> = ({
  currencyImages,
  setCurrency,
  selectedCurrency,
}) => {
  const currencyCodesFromDB = useContext(useCurrenciesFromDBContext);

  const [spinIsActive, setspinIsActive] = useState<string>("");

  const setCurrencyAfterClick = (
    currency_code: string,
    currency_symbol: string,
    currency_name: string
  ) => {
    setCurrency(currency_code, currency_symbol, currency_name);
  };

  if (currencyCodesFromDB === undefined) {
    return null;
  }
  return (
    <Fragment>
      <div className="currencySelectDropDownContainer">
        <b>Show values in</b>
        <ul className="currencySelectDropDownList">
          {currencyCodesFromDB?.map((data) => (
            <li
              key={data.id}
              id={data.currency_code}
              className={
                selectedCurrency.currency_code === data.currency_code
                  ? "currencySelectDropDownListItemActive"
                  : "currencySelectDropDownListItem"
              }
              onMouseEnter={() => setspinIsActive(data.currency_code)}
              onMouseLeave={() => setspinIsActive("")}
              onClick={() =>
                setCurrencyAfterClick(
                  data.currency_code,
                  data.currency_symbol,
                  data.currency_name
                )
              }
            >
              <motion.img
                src={currencyImages[`${data.currency_code}.svg`]}
                alt={data.currency_name}
                className="currencyFlagImage"
                animate={{
                  rotate: spinIsActive === data.currency_code ? 360 : 0,
                }}
              />
              <button>{data.currency_name}</button>
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default OptionsBoardCurrencySelect;
