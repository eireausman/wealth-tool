import React from "react";
import OptionsBoardCurrencySelect from "./OptionsBoardCurrencySelect";
import { OptionsBoardNarrowProps } from "../../../types/typeInterfaces";
import OptionsBoardNetWealth from "./OptionsBoardNetWealth";
import OptionsBoardTotalAssets from "./OptionsBoardTotalAssets";
import OptionsBoardTotalDebt from "./OptionsBoardTotalDebt";
import { Link } from "react-router-dom";
import OptionsBoardLogoutLink from "./OptionsBoardLogoutLink";
import "./OptionsBoardNarrow.css";

const OptionsBoardNarrow: React.FC<OptionsBoardNarrowProps> = ({
  setCurrency,
  selectedCurrency,
  currencyCodesFromDB,
  selectedCurrencySymbol,
  netWealthValue,
  totalPosAssets,
  totalDebtValue,
  windowWidth,
  wideWidthLimit,
  loggedInUser,
  performLogoutAction,
}) => {
  return (
    <div className="optionsBoard optionsBoardNarrow">
      <div className="wealthSummaryNarrow">
        <OptionsBoardNetWealth
          netWealthValue={netWealthValue}
          selectedCurrencySymbol={selectedCurrencySymbol}
        />
        <OptionsBoardTotalAssets
          totalPosAssets={totalPosAssets}
          selectedCurrencySymbol={selectedCurrencySymbol}
        />
        <OptionsBoardTotalDebt
          totalDebtValue={totalDebtValue}
          selectedCurrencySymbol={selectedCurrencySymbol}
        />
        <OptionsBoardCurrencySelect
          setCurrency={setCurrency}
          selectedCurrency={selectedCurrency}
          currencyCodesFromDB={currencyCodesFromDB}
          windowWidth={windowWidth}
          wideWidthLimit={wideWidthLimit}
        />
      </div>
      <div className="narrowOptionsContainer">
        {loggedInUser === undefined ? (
          <div className="loginBox">
            <div className="loginBoxLink">
              <Link to="/login">Login</Link>
            </div>
            <div className="loginBoxLink">
              <Link to="/createaccount">Create Account</Link>
            </div>
          </div>
        ) : (
          <OptionsBoardLogoutLink
            windowWidth={windowWidth}
            wideWidthLimit={wideWidthLimit}
            performLogoutAction={performLogoutAction}
            loggedInUser={loggedInUser}
          />
        )}
      </div>
    </div>
  );
};

export default OptionsBoardNarrow;
