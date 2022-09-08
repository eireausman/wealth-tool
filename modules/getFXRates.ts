import { currencyCodesAPIData } from "../types/typeInterfaces";
import {
  getCurrencyDataFromDB,
  insertFXRateIntoDB,
  wereRatesUpdatedRecently,
} from "./database_actions";

const axios = require("axios");

const updateFXRates = async () => {
  const areFXRatesUpToDate = await wereRatesUpdatedRecently();
  if (areFXRatesUpToDate === false) {
    const currenciesFromDB = await getCurrencyDataFromDB();
    const FXDataURLsList: Array<string> = [];
    currenciesFromDB.forEach((fromCurrency: currencyCodesAPIData) => {
      const URL = `${process.env.FXRATES_API_URL}${fromCurrency.currency_code}`;
      FXDataURLsList.push(URL);
    });

    FXDataFromAPI(FXDataURLsList, currenciesFromDB);
  }
  console.log("FXRates update functions have been run");
};

const FXDataFromAPI = async (
  FXDataURLsList: Array<string>,
  currenciesFromDB: Array<currencyCodesAPIData>
) => {
  for (let url of FXDataURLsList) {
    const serverResponse = await axios.get(url);

    for (let currency of currenciesFromDB) {
      const fromCurrencyCode = serverResponse.data.base_code;
      const toCurrencyCode = currency.currency_code;
      const fxRate = serverResponse.data.conversion_rates[toCurrencyCode];

      await insertFXRateIntoDB(fromCurrencyCode, toCurrencyCode, fxRate);
    }
  }
};

export default updateFXRates;
