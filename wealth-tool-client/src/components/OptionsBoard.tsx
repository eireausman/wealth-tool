import React, { useState, useEffect } from "react";
import { OptionsBoardProps } from "../../../types/typeInterfaces";
import {
  getTotalPosAssets,
  getTotalDebtValue,
  logUserOut,
} from "../modules/serverRequests";
import "./OptionsBoard.css";
import getDisplayNumber from "../modules/getDisplayNumber";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const OptionsBoard: React.FC<OptionsBoardProps> = ({
  selectedCurrencyCode: selectedCurrency,
  selectedCurrencySymbol,
  setselectedCurrencyCode,
  currencyCodesFromDB,
  setselectedCurrencySymbol,
  loggedInUser,
  setloggedInUser,
  triggerRecalculations,
}) => {
  const [totalDebtValue, settotalDebtValue] = useState<number>(0);
  const [netWealthValue, setnetWealthValue] = useState<number>(0);
  const [totalPosAssets, settotalPosAssets] = useState<number>(0);

  const setCurrency = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLSelectElement;

    currencyCodesFromDB?.forEach((item) => {
      if (item.currency_code === target.value) {
        setselectedCurrencyCode(item.currency_code);
        setselectedCurrencySymbol(item.currency_symbol);
        localStorage.setItem("selectedCurrencyCode", item.currency_code);
        localStorage.setItem("selectedCurrencySymbol", item.currency_symbol);
      }
    });
  };

  const navigate = useNavigate();
  const performLogoutAction = async () => {
    await logUserOut(); // errors handled in serverRequest file
    setloggedInUser(false);
    navigate("/login");
  };

  const getValueTotalPosAssets = async () => {
    const totalPostAssetsData = await getTotalPosAssets(selectedCurrency);

    const totalPosAssetsInteger = parseInt(totalPostAssetsData.convertedTotal);

    settotalPosAssets(totalPosAssetsInteger);
    return totalPosAssetsInteger;
  };

  const getValueTotalDeb = async () => {
    const totalDebtServerData = await getTotalDebtValue(selectedCurrency);

    const totalDebtInteger = parseInt(totalDebtServerData.convertedTotal);

    settotalDebtValue(totalDebtInteger);
    return totalDebtInteger;
  };

  const getCalculatedNetWealth = async () => {
    Promise.all([getValueTotalPosAssets(), getValueTotalDeb()]).then((data) => {
      let calculatedNetWealth = data[0] + data[1];
      setnetWealthValue(calculatedNetWealth);
    });
  };

  useEffect(() => {
    getCalculatedNetWealth();
  }, [selectedCurrency, triggerRecalculations]);

  return (
    <div className="optionsBoard">
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
      <div className="wealthSummary">
        <div className="totalAssetBox">
          <b>Net Wealth</b>{" "}
          <span
            className={
              netWealthValue < 0
                ? "optionsBoardNegative"
                : "optionsBoardPositive"
            }
          >
            {selectedCurrencySymbol}
            {getDisplayNumber(netWealthValue)}
          </span>
        </div>{" "}
        <div className="totalAssetBox">
          <b>Total Assets</b>{" "}
          <span
            className={
              totalPosAssets < 0
                ? "optionsBoardNegative"
                : "optionsBoardPositive"
            }
          >
            {selectedCurrencySymbol}
            {getDisplayNumber(totalPosAssets)}
          </span>
        </div>
        <div className="totalAssetBox">
          <b>Total Debt </b>
          <span
            className={
              totalDebtValue < 0
                ? "optionsBoardNegative"
                : "optionsBoardPositive"
            }
          >
            {selectedCurrencySymbol}
            {getDisplayNumber(totalDebtValue)}
          </span>
        </div>
      </div>

      {loggedInUser === undefined ? (
        <div className="loginBox">
          <div className="loginBoxLink">
            <Link to="/login">Login</Link>
          </div>
          <div className="loginBoxLink">
            <Link to="/createaccount">Create Account</Link>
          </div>{" "}
        </div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="loginBox"
        >
          <div className="loginBoxLink" onClick={performLogoutAction}>
            Logout ({loggedInUser})
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OptionsBoard;
