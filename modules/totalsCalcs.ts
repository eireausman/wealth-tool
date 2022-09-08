import { Key } from "readline";
import {
  cashAccountAPIData,
  investmentsAPIData,
  propertiesAPIData,
  totalsByCurr,
} from "../types/typeInterfaces";

exports.calculateTotalsByCurr = function (
  investSummary: Array<investmentsAPIData>,
  CashAccSummary: Array<cashAccountAPIData>,
  propSummary: Array<propertiesAPIData>
) {
  const currenciesArray: Array<string> = [];

  investSummary.forEach((item) => {
    currenciesArray.push(item.holding_currency_code);
  });

  CashAccSummary.forEach((item) => {
    currenciesArray.push(item.account_currency_code);
  });

  propSummary.forEach((item) => {
    currenciesArray.push(item.property_valuation_currency);
  });
  //gets unique currencies list from above sets:
  const uniqueCurrenciesList = [
    ...new Set(currenciesArray.map((item) => item)),
  ];

  let totalsByCurr: totalsByCurr = {};

  uniqueCurrenciesList.forEach((currencyCode) => {
    if (!totalsByCurr.hasOwnProperty(currencyCode)) {
      totalsByCurr[currencyCode] = 0;
    }
    investSummary.forEach((item) => {
      if (
        item.holding_currency_code === currencyCode &&
        typeof item.total === "number"
      ) {
        totalsByCurr[currencyCode] =
          parseInt(totalsByCurr[currencyCode].toString()) +
          parseInt(item.total.toString());
      }
    });
    CashAccSummary.forEach((item) => {
      if (
        item.account_currency_code === currencyCode &&
        typeof item.total === "number"
      ) {
        totalsByCurr[currencyCode] =
          parseInt(totalsByCurr[currencyCode].toString()) +
          parseInt(item.total.toString());
      }
    });
    propSummary.forEach((item) => {
      if (
        item.property_valuation_currency === currencyCode &&
        typeof item.total === "number"
      ) {
        totalsByCurr[currencyCode] =
          parseInt(totalsByCurr[currencyCode].toString()) +
          parseInt(item.total.toString());
      }
    });
  });

  return totalsByCurr;
};
