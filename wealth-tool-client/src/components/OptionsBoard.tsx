import React, { useState, useEffect, useRef, Fragment } from "react";
import { OptionsBoardProps } from "../../../types/typeInterfaces";
import {
  getTotalPosAssets,
  getTotalDebtValue,
  logUserOut,
} from "../modules/serverRequests";
import "./OptionsBoard.css";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useWindowSize from "../hooks/windowSize";
import OptionsBoardNarrow from "./OptionsBoardNarrow";
import OptionsBoardWide from "./OptionsBoardWide";
import OptionsBoardLogoutLink from "./OptionsBoardLogoutLink";
import { AxiosResponse } from "axios";

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
  const { windowHeight, windowWidth } = useWindowSize();
  const wideWidthLimit = useRef<number>(920);

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
    const totalPostAssetsData: AxiosResponse<any, any> | undefined =
      await getTotalPosAssets(selectedCurrency);

    if (
      totalPostAssetsData !== undefined &&
      totalPostAssetsData.status === 200
    ) {
      const totalPosAssetsInteger = parseInt(
        totalPostAssetsData.data.convertedTotal
      );
      settotalPosAssets(totalPosAssetsInteger);
      return totalPosAssetsInteger;
    }
  };

  const getValueTotalDeb = async () => {
    const totalDebtServerData: AxiosResponse<any, any> | undefined =
      await getTotalDebtValue(selectedCurrency);
    if (totalDebtServerData !== undefined) {
      const totalDebtInteger = parseInt(
        totalDebtServerData.data.convertedTotal
      );

      settotalDebtValue(totalDebtInteger);
      return totalDebtInteger;
    }
  };

  const getCalculatedNetWealth = async () => {
    Promise.all([getValueTotalPosAssets(), getValueTotalDeb()]).then((data) => {
      if (
        typeof data[0] === "number" &&
        !isNaN(data[0]) &&
        typeof data[1] === "number" &&
        !isNaN(data[1])
      ) {
        let calculatedNetWealth = data[0] + data[1];
        setnetWealthValue(calculatedNetWealth);
      } else {
        setnetWealthValue(0);
      }
    });
  };

  useEffect(() => {
    getCalculatedNetWealth();
  }, [selectedCurrency, triggerRecalculations]);

  return (
    <Fragment>
      {windowWidth > wideWidthLimit.current ? (
        <OptionsBoardWide
          windowWidth={windowWidth}
          wideWidthLimit={wideWidthLimit.current}
          setCurrency={setCurrency}
          selectedCurrency={selectedCurrency}
          currencyCodesFromDB={currencyCodesFromDB}
          selectedCurrencySymbol={selectedCurrencySymbol}
          netWealthValue={netWealthValue}
          totalPosAssets={totalPosAssets}
          totalDebtValue={totalDebtValue}
          performLogoutAction={performLogoutAction}
          loggedInUser={loggedInUser}
        />
      ) : (
        <OptionsBoardNarrow
          windowWidth={windowWidth}
          wideWidthLimit={wideWidthLimit.current}
          setCurrency={setCurrency}
          selectedCurrency={selectedCurrency}
          currencyCodesFromDB={currencyCodesFromDB}
          selectedCurrencySymbol={selectedCurrencySymbol}
          netWealthValue={netWealthValue}
          totalPosAssets={totalPosAssets}
          totalDebtValue={totalDebtValue}
          performLogoutAction={performLogoutAction}
          loggedInUser={loggedInUser}
        />
      )}
    </Fragment>
  );
};

export default OptionsBoard;
