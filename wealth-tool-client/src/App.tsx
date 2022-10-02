import React, { useEffect, Fragment, useState } from "react";
import CashAccounts from "./components/CashAccounts";
import OptionsBoard from "./components/OptionsBoard";
import Properties from "./components/Properties";
import {
  AssetCountContextCountData,
  currencyCodesAPIData,
} from "../../types/typeInterfaces";
import {
  checkifuserloggedin,
  getCurrencyCodeData,
  usersAssetCount,
} from "./modules/serverRequests";
import ChartNetWealthCategories from "./components/ChartNetWealthCategories";
import Investments from "./components/Investments";
import FXRates from "./components/FXRates";
import { useNavigate } from "react-router-dom";
import ViewCardCascadeTitleRow from "./components/ViewCardCascadeTitleRow";
import { LoggedInContext, AssetCountContext } from "./modules/Contexts";
import InvestmentsPriceChart from "./components/InvestmentsPriceChart";

function App() {
  const [selectedCurrencyCode, setselectedCurrencyCode] =
    useState<string>("AUD");
  const [selectedCurrencySymbol, setselectedCurrencySymbol] =
    useState<string>("$");
  const [currencyCodesFromDB, setcurrencyCodesFromDB] =
    useState<Array<currencyCodesAPIData>>();
  const [assetCountDBOutput, setassetCountDBOutput] =
    useState<AssetCountContextCountData>({ totalAssetCount: 0 });
  const [loggedInUser, setloggedInUser] = useState<false | string>(false);
  const [triggerRecalculations, settriggerRecalculations] = useState<number>(0); // used to trigger a reclalc for components comibing figures from other component updates

  const navigate = useNavigate();
  useEffect(() => {
    checkifuserloggedin().then((data) => {
      if (data === false || data === undefined) {
        navigate("/login");
      }
      setloggedInUser(data); // username or undefined if not logged in
    });
  }, []);

  useEffect(() => {
    usersAssetCount().then((data) => {
      setassetCountDBOutput(data);
    });
  }, [triggerRecalculations]);

  useEffect(() => {
    if (currencyCodesFromDB === undefined) {
      getCurrencyCodeData()
        .then((data) => {
          setcurrencyCodesFromDB(data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <AssetCountContext.Provider value={assetCountDBOutput}>
      <LoggedInContext.Provider value={loggedInUser}>
        <OptionsBoard
          selectedCurrencyCode={selectedCurrencyCode}
          selectedCurrencySymbol={selectedCurrencySymbol}
          setselectedCurrencyCode={setselectedCurrencyCode}
          currencyCodesFromDB={currencyCodesFromDB}
          setselectedCurrencySymbol={setselectedCurrencySymbol}
          loggedInUser={loggedInUser}
          setloggedInUser={setloggedInUser}
          triggerRecalculations={triggerRecalculations}
        />
        <InvestmentsPriceChart />
        <ViewCardCascadeTitleRow
          sectionTitle="Your Assets"
          showIfNoAssets={true}
        />
        <div className="viewCardsCascade">
          <CashAccounts
            selectedCurrencyCode={selectedCurrencyCode}
            selectedCurrencySymbol={selectedCurrencySymbol}
            currencyCodesFromDB={currencyCodesFromDB}
            settriggerRecalculations={settriggerRecalculations}
            triggerRecalculations={triggerRecalculations}
          />
          <Properties
            selectedCurrencyCode={selectedCurrencyCode}
            selectedCurrencySymbol={selectedCurrencySymbol}
            currencyCodesFromDB={currencyCodesFromDB}
            settriggerRecalculations={settriggerRecalculations}
            triggerRecalculations={triggerRecalculations}
          />
          <Investments
            selectedCurrencyCode={selectedCurrencyCode}
            selectedCurrencySymbol={selectedCurrencySymbol}
            currencyCodesFromDB={currencyCodesFromDB}
            settriggerRecalculations={settriggerRecalculations}
            triggerRecalculations={triggerRecalculations}
          />
        </div>
        <ViewCardCascadeTitleRow
          sectionTitle="Asset Analysis"
          showIfNoAssets={false}
        />
        <div className="viewCardsCascade">
          <ChartNetWealthCategories
            selectedCurrencyCode={selectedCurrencyCode}
            triggerRecalculations={triggerRecalculations}
          />
        </div>
        <ViewCardCascadeTitleRow sectionTitle="Data" showIfNoAssets={false} />
        <div className="viewCardsCascade">
          <FXRates />
        </div>
      </LoggedInContext.Provider>
    </AssetCountContext.Provider>
  );
}

export default App;
