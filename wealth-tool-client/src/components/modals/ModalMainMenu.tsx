import React, { useContext, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import {
  selectedCurrencyDetails,
  currencyImagesList,
} from "../../../../types/typeInterfaces";
import { useLoggedInContext } from "../../modules/Contexts";
import {
  getTotalDebtValue,
  getTotalPosAssets,
  logUserOut,
} from "../../modules/serverRequests";
import styles from "./ModalMainMenu.module.css";
import OptionsBoardNetWealth from "../wealthTotals/OptionsBoardNetWealth";
import OptionsBoardTotalAssets from "../wealthTotals/OptionsBoardTotalAssets";
import OptionsBoardTotalDebt from "../wealthTotals/OptionsBoardTotalDebt";
import OptionsBoardCurrencySelect from "../menuItems/OptionsBoardCurrencySelect";
import { motion } from "framer-motion";
import { CgCloseR, CgMenu } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import OptionsBoardLogoutLink from "../menuItems/OptionsBoardLogoutLink";

interface ModalMainMenuProps {
  setloggedInUser: React.Dispatch<React.SetStateAction<string | false>>;
  triggerRecalculations: number;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  setselectedCurrency: React.Dispatch<
    React.SetStateAction<selectedCurrencyDetails>
  >;
  selectedCurrency: selectedCurrencyDetails;
  currencyImages: currencyImagesList;
}

const ModalMainMenu: React.FC<ModalMainMenuProps> = ({
  setloggedInUser,
  triggerRecalculations,
  settriggerRecalculations,
  setselectedCurrency,
  selectedCurrency,
  currencyImages,
}) => {
  const loggedInUser = useContext(useLoggedInContext);

  const [showSlideOutMenu, setshowSlideOutMenu] = useState<boolean>(false);
  const [closeButtonSpinIsActive, setcloseButtonSpinIsActive] =
    useState<boolean>(false);
  const [burgerButtonSpinIsActive, setburgerButtonSpinIsActive] =
    useState<boolean>(false);
  const [totalDebtValue, settotalDebtValue] = useState<number | undefined>(0);
  const [netWealthValue, setnetWealthValue] = useState<number | undefined>(0);
  const [totalPosAssets, settotalPosAssets] = useState<number | undefined>(0);

  const getValueTotalPosAssets = async () => {
    const totalPostAssetsData: AxiosResponse<any, any> | undefined =
      await getTotalPosAssets(selectedCurrency.currency_code);

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
      await getTotalDebtValue(selectedCurrency.currency_code);
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

  const navigate = useNavigate();
  const performLogoutAction = async () => {
    await logUserOut(); // errors handled in serverRequest process
    setloggedInUser(false);
    navigate("/login");
  };

  useEffect(() => {
    settotalDebtValue(undefined);
    setnetWealthValue(undefined);
    settotalPosAssets(undefined);
    getCalculatedNetWealth();
  }, [selectedCurrency, triggerRecalculations]);

  const setCurrency = (
    currency_code: string,
    currency_symbol: string,
    currency_name: string
  ) => {
    const selectCurrenciesObject = { ...selectedCurrency };
    selectCurrenciesObject.currency_code = currency_code;
    selectCurrenciesObject.currency_symbol = currency_symbol;
    selectCurrenciesObject.currency_name = currency_name;
    setselectedCurrency(selectCurrenciesObject);
    settriggerRecalculations(() => triggerRecalculations + 1);

    localStorage.setItem(
      "selectedCurrency",
      JSON.stringify(selectCurrenciesObject)
    );
  };

  const hideSlideOutMenu = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className === "modalMainMenuContainer") {
      setshowSlideOutMenu(false);
    }
  };

  return (
    <>
      <div className={styles.modalMainMenuTeaser}>
        <div
          onClick={() => setshowSlideOutMenu(true)}
          className={styles.modalMainMenuTeaserBtnContainer}
        >
          <OptionsBoardNetWealth
            netWealthValue={netWealthValue}
            selectedCurrency={selectedCurrency}
            showInfo={false}
          />

          <motion.span
            animate={{
              rotate: burgerButtonSpinIsActive === true ? 360 : 0,
            }}
            onMouseEnter={() => setburgerButtonSpinIsActive(true)}
            onMouseLeave={() => setburgerButtonSpinIsActive(false)}
          >
            <CgMenu size={28} color={"black"} />
          </motion.span>
        </div>
      </div>
      {showSlideOutMenu === true && (
        <section
          className={styles.modalMainMenuContainer}
          onClick={hideSlideOutMenu}
        >
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className={styles.modalMainMenuSlideOut}
          >
            <motion.button
              className={styles.ModalMainMenuCloseButton}
              animate={{
                rotate: closeButtonSpinIsActive === true ? 360 : 0,
              }}
              onMouseEnter={() => setcloseButtonSpinIsActive(true)}
              onMouseLeave={() => setcloseButtonSpinIsActive(false)}
              onClick={() => setshowSlideOutMenu(false)}
            >
              <CgCloseR size={"1.4em"} color={"white"} />
            </motion.button>
            <b>Your Wealth Summary</b>
            <OptionsBoardNetWealth
              netWealthValue={netWealthValue}
              selectedCurrency={selectedCurrency}
              showInfo={true}
            />
            <OptionsBoardTotalAssets
              totalPosAssets={totalPosAssets}
              selectedCurrencySymbol={selectedCurrency.currency_symbol}
            />
            <OptionsBoardTotalDebt
              totalDebtValue={totalDebtValue}
              selectedCurrencySymbol={selectedCurrency.currency_symbol}
            />
            <OptionsBoardCurrencySelect
              currencyImages={currencyImages}
              setCurrency={setCurrency}
              selectedCurrency={selectedCurrency}
            />

            <OptionsBoardLogoutLink
              performLogoutAction={performLogoutAction}
              loggedInUser={loggedInUser}
            />
          </motion.div>
        </section>
      )}
    </>
  );
};

export default ModalMainMenu;
