import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import OptionsBoardCurrencySelect from "./OptionsBoardCurrencySelect";
import { OptionsBoardWideProps } from "../../../types/typeInterfaces";
import OptionsBoardNetWealth from "./OptionsBoardNetWealth";
import OptionsBoardTotalAssets from "./OptionsBoardTotalAssets";
import OptionsBoardTotalDebt from "./OptionsBoardTotalDebt";
import OptionsBoardLogoutLink from "./OptionsBoardLogoutLink";

const OptionsBoardWide: React.FC<OptionsBoardWideProps> = ({
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
    <div className="optionsBoard">
      <OptionsBoardCurrencySelect
        setCurrency={setCurrency}
        selectedCurrency={selectedCurrency}
        currencyCodesFromDB={currencyCodesFromDB}
        windowWidth={windowWidth}
        wideWidthLimit={wideWidthLimit}
      />
      <div className="wealthSummary">
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
      </div>
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
  );
};

export default OptionsBoardWide;
