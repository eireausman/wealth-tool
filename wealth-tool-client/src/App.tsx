import React, { useEffect, Fragment, useState } from "react";
import CashAccounts from "./components/CashAccounts";
import Properties from "./components/Properties";
import {
  AssetCountContextCountData,
  currencyCodesAPIData,
  selectedCurrencyDetails,
  currencyImagesList,
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
import {
  useLoggedInContext,
  useAssetCountContext,
  useCurrenciesFromDBContext,
} from "./modules/Contexts";
import ModalMainMenu from "./components/ModalMainMenu";

function importCurrencyImages(imagesFolder: __WebpackModuleApi.RequireContext) {
  let images: currencyImagesList = {};
  imagesFolder.keys().forEach((item: string, index: number) => {
    images[item.replace("./", "")] = imagesFolder(item);
  });
  return images;
}
const currencyImages = importCurrencyImages(
  require.context("./assets/images/currencies", false, /\.(png|jpe?g|svg)$/)
);

function App() {
  const [selectedCurrency, setselectedCurrency] =
    useState<selectedCurrencyDetails>({
      currency_code: "AUD",
      currency_symbol: "$",
      currency_name: "Australian Dollar",
    });
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
    <useLoggedInContext.Provider value={loggedInUser}>
      <useAssetCountContext.Provider value={assetCountDBOutput}>
        <useCurrenciesFromDBContext.Provider value={currencyCodesFromDB}>
          <ModalMainMenu
            setloggedInUser={setloggedInUser}
            settriggerRecalculations={settriggerRecalculations}
            triggerRecalculations={triggerRecalculations}
            selectedCurrency={selectedCurrency}
            setselectedCurrency={setselectedCurrency}
            currencyImages={currencyImages}
          />
          <ViewCardCascadeTitleRow
            sectionTitle="Your Assets"
            showIfNoAssets={true}
          />
          <div className="viewCardsCascade">
            <CashAccounts
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
              selectedCurrency={selectedCurrency}
            />
            <Properties
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
              selectedCurrency={selectedCurrency}
            />
            <Investments
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
              selectedCurrency={selectedCurrency}
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
        </useCurrenciesFromDBContext.Provider>
      </useAssetCountContext.Provider>
    </useLoggedInContext.Provider>
  );
}

export default App;
