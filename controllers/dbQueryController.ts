import sq from "date-fns/locale/sq";
import { Request, Response, NextFunction } from "express";

import {
  addNewCashAccountToDB,
  addNewInvestmentToDB,
  addNewPropertyToDB,
  getAllFXRatesFromDB,
  getCashAccountDataFromDB,
  getCurrencyDataFromDB,
  getDebtCashAccountTotalsByCurrency,
  getDebtPropertyTotalsByCurrency,
  getFXRateFromDB,
  getInvestmentDataFromDB,
  getNetCashAccountTotalsByCurrency,
  getNetPropertyTotalsByCurrency,
  getPosCashAccountTotalsByCurrency,
  getPosInvestmentTotalsByCurrency,
  getPosPropertyTotalsByCurrency,
  getPropertyDataFromDB,
  updateAccountBalanceToDB,
  updatePropValueToDB,
  searchForStockCompanyByNameFromDB,
  updateSingleInvestmentToDB,
  deleteCashAccountFromDB,
  deletePropertyFromDB,
  deleteInvestmentFromDB,
  countUsersInvestments,
  countUsersCashAccounts,
  countUsersProperties,
} from "../modules/database_actions";
import { getCompanyPriceData } from "../modules/getCompanyPriceData";

import {
  cashAccountAPIData,
  investmentsAPIData,
  propertiesAPIData,
} from "../types/typeInterfaces";

const totalsCalc = require("../modules/totalsCalcs");

exports.addNewInvestment = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newInvestmentData = await addNewInvestmentToDB(
      res.locals.currentUser.id,
      req.body
    );
    const dataArray = JSON.parse(JSON.stringify(newInvestmentData));

    res.send(dataArray);
  } catch (error) {
    console.log(error);
  }
};

exports.usersAssetCount = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = res.locals.currentUser.id;
  let totalCount = 0;
  const investmentCount = await countUsersInvestments(user);
  totalCount += investmentCount;
  const cashAccountCount = await countUsersCashAccounts(user);
  totalCount += cashAccountCount;
  const propertiesCount = await countUsersProperties(user);
  totalCount += propertiesCount;

  res.json({
    investments: investmentCount,
    cashAccounts: cashAccountCount,
    properties: propertiesCount,
    totalAssetCount: totalCount,
  });
};

exports.refreshSingleStockPricingData = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // update the pricing data for the new stock in case it doesn't already have price history for another user:
    const companyTicker = req.body.identifier;
    const DBpriceUpdate = await getCompanyPriceData(companyTicker);

    res.send(DBpriceUpdate);
  } catch (error) {
    console.log(error);
  }
};

exports.addNewCashAccount = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newPropertyData = addNewCashAccountToDB(
    res.locals.currentUser.id,
    req.body
  ).then((data) => {
    res.send(data);
  });
};

exports.getDebtTotalValue = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  }
  // investments cannot be in debt, so no query required.  Empty array provided to pass to totalsByCurr.
  // This is a bit messy. Refactoring isn't straight forward because a list of all currencies needs providing which is a combined view.
  // That happens downstream from here.
  const investSummary: Array<undefined> = [];

  const CashAccSummary: cashAccountAPIData =
    await getDebtCashAccountTotalsByCurrency(res.locals.currentUser.id);
  const propSummary = await getDebtPropertyTotalsByCurrency(
    res.locals.currentUser.id
  );

  // if no entries exist, exit
  if (!CashAccSummary && !propSummary) {
    res.send({ convertedTotal: 0 });
    return;
  }
  let CashAccSummaryArray = [];

  if (CashAccSummary) {
    CashAccSummaryArray = JSON.parse(
      JSON.stringify(CashAccSummary.cash_accounts)
    );
  }
  let propSummaryArray = [];
  if (propSummary) {
    propSummaryArray = JSON.parse(JSON.stringify(propSummary.properties));
  }

  // combine the above and get a summary by currency rather than by asset type by currency
  const totalsByCurr = totalsCalc.calculateTotalsByCurr(
    investSummary,
    CashAccSummaryArray,
    propSummaryArray
  );

  // convert to the currently selected currency in front end and return the sum of converted values
  let convertedTotal = 0;
  const selectedCurrency = req.query.selectedcurrency;
  if (!selectedCurrency) {
    res.status(400).json({ error: "Currency not specified" });
    return;
  }

  if (typeof selectedCurrency !== "string") {
    res.status(500).json({ error: "Invalid currency specified" });
    return;
  }
  for (let item in totalsByCurr) {
    const itemValue = totalsByCurr[item];
    const rateQuery = await getFXRateFromDB(item, selectedCurrency);
    const rate = rateQuery.currency_fxrate;
    convertedTotal += itemValue * rate;
  }

  res.send({ convertedTotal });
};

exports.getTotalPosAssetValue = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  }

  const investSummary = await getPosInvestmentTotalsByCurrency(
    res.locals.currentUser.id
  );
  const CashAccSummary = await getPosCashAccountTotalsByCurrency(
    res.locals.currentUser.id
  );
  const propSummary = await getPosPropertyTotalsByCurrency(
    res.locals.currentUser.id
  );

  // if no entries exist, exit
  if (!investSummary && !CashAccSummary && !propSummary) {
    res.sendStatus(204);
    return;
  }

  let investSummaryArray: Array<investmentsAPIData> = [];
  if (investSummary) {
    investSummaryArray = JSON.parse(JSON.stringify(investSummary.investments));
  }

  investSummaryArray.forEach((data) => {
    data.total = "0";
    if (data.investment_price_histories.length > 0) {
      const pencePrice =
        parseFloat(data.investment_price_histories[0].holding_current_price) /
        100;

      const total = data.holding_quantity_held * pencePrice;
      data.total = total.toString();
    }
  });

  let CashAccSummaryArray: Array<cashAccountAPIData> = [];
  if (CashAccSummary) {
    CashAccSummaryArray = JSON.parse(
      JSON.stringify(CashAccSummary.cash_accounts)
    );
  }
  let propSummaryArray: Array<propertiesAPIData> = [];
  if (propSummary) {
    propSummaryArray = JSON.parse(JSON.stringify(propSummary.properties));
  }

  // combine the above and get a summary by currency rather than by asset type by currency
  const totalsByCurr = totalsCalc.calculateTotalsByCurr(
    investSummaryArray,
    CashAccSummaryArray,
    propSummaryArray
  );

  let convertedTotal = 0;
  const selectedCurrency = req.query.selectedcurrency;
  if (!selectedCurrency) {
    res.status(400).json({ error: "Currency not specified" });
    return;
  }

  if (typeof selectedCurrency !== "string") {
    res.status(500).json({ error: "Invalid currency specified" });
    return;
  }
  for (let item in totalsByCurr) {
    const itemValue = totalsByCurr[item];
    const rateQuery = await getFXRateFromDB(item, selectedCurrency);
    const rate = rateQuery.currency_fxrate;
    convertedTotal += itemValue * rate;
  }

  res.send({ convertedTotal });
};

exports.getCashAccountNetTotal = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  }
  const CashAccSummary = await getNetCashAccountTotalsByCurrency(
    res.locals.currentUser.id
  );

  if (!CashAccSummary) {
    res.sendStatus(204);
    return;
  }

  const CashAccSummaryArray = JSON.parse(
    JSON.stringify(CashAccSummary.cash_accounts)
  );

  const selectedCurrency = req.query.selectedcurrency;
  if (!selectedCurrency) {
    res.status(400).json({ error: "Currency not specified" });
    return;
  }

  if (typeof selectedCurrency !== "string") {
    res.status(500).json({ error: "Invalid currency specified" });
    return;
  }
  let CashAccSummaryConvertedTotal: number = 0;

  for (let item in CashAccSummaryArray) {
    const fromCurrency: string =
      CashAccSummaryArray[item].account_currency_code;
    const totalVal: number = parseInt(CashAccSummaryArray[item].total);
    const rateQuery = await getFXRateFromDB(fromCurrency, selectedCurrency);
    const rate: number = rateQuery.currency_fxrate;

    CashAccSummaryConvertedTotal += totalVal * rate;
  }
  const returnNumber: number = CashAccSummaryConvertedTotal;

  res.json(returnNumber);
};

exports.getPropertyNetTotal = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  }
  const propSummary = await getNetPropertyTotalsByCurrency(
    res.locals.currentUser.id
  );

  if (!propSummary) {
    res.sendStatus(204);
    return;
  }
  const propSummaryArray = JSON.parse(JSON.stringify(propSummary.properties));

  const selectedCurrency = req.query.selectedcurrency;
  if (!selectedCurrency) {
    res.status(400).json({ error: "Currency not specified" });
    return;
  }

  if (typeof selectedCurrency !== "string") {
    res.status(500).json({ error: "Invalid currency specified" });
    return;
  }
  let propSummaryConvertedTotal: number = 0;
  for (let item in propSummaryArray) {
    const fromCurrency: string =
      propSummaryArray[item].property_valuation_currency;
    const totalVal: number = parseInt(propSummaryArray[item].total);

    const rateQuery = await getFXRateFromDB(fromCurrency, selectedCurrency);
    const rate: number = rateQuery.currency_fxrate;
    propSummaryConvertedTotal += totalVal * rate;
  }
  const returnNumber: number = propSummaryConvertedTotal;

  res.json(returnNumber);
};

exports.searchForStockCompanyByName = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const searchString = req.query.searchstring;

  if (!searchString || typeof searchString !== "string") {
    res.sendStatus(204).json("No search string criteria was provided");
    return;
  }
  const searchResults = await searchForStockCompanyByNameFromDB(searchString);

  const searchResultsArray = JSON.parse(JSON.stringify(searchResults));

  res.send(searchResultsArray);
};

exports.getInvestmentsTotal = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  }
  // investments will be + or 0, and so only need to request Pos db query:
  // const investSummary = await getPosInvestmentTotalsByCurrency(
  const investSummary = await getInvestmentDataFromDB(
    res.locals.currentUser.id
  );

  if (!investSummary) {
    res.sendStatus(204);
    return;
  }

  const investSummaryArray = JSON.parse(
    JSON.stringify(investSummary.investments)
  );

  const selectedCurrency = req.query.selectedcurrency;

  if (!selectedCurrency) {
    res.status(400).json({ error: "Currency not specified" });
    return;
  }

  if (typeof selectedCurrency !== "string") {
    res.status(500).json({ error: "Invalid currency specified" });
    return;
  }
  let investSummaryConvertedTotal: number = 0;
  for (let item in investSummaryArray) {
    const fromCurrency: string = investSummaryArray[item].holding_currency_code;

    if (investSummaryArray[item].investment_price_histories.length > 0) {
      const pencePrice =
        parseFloat(
          investSummaryArray[item].investment_price_histories[0]
            .holding_current_price
        ) / 100;

      const valCalc: number =
        parseInt(investSummaryArray[item].holding_quantity_held) * pencePrice;

      const totalVal = parseInt(valCalc.toString());

      const rateQuery = await getFXRateFromDB(fromCurrency, selectedCurrency);
      const rate: number = rateQuery.currency_fxrate;
      investSummaryConvertedTotal += totalVal * rate;
    }
  }

  const returnNumber = parseInt(investSummaryConvertedTotal.toString());

  res.json(returnNumber);
};

exports.addNewProperty = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newPropertyData = addNewPropertyToDB(
    res.locals.currentUser.id,
    req.body
  ).then((data) => {
    res.send(data);
  });
};

exports.getCashAccountData = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  }

  let selectedOrderBy = req.query.sortby;

  if (typeof selectedOrderBy !== "string") {
    selectedOrderBy = undefined;
  }

  const cashAccountData = await getCashAccountDataFromDB(
    res.locals.currentUser.id,
    selectedOrderBy
  );
  if (!cashAccountData) {
    res.sendStatus(204);
    return;
  }

  const cashAccountArrray = JSON.parse(
    JSON.stringify(cashAccountData.cash_accounts)
  );
  // convert to the currency selected in front end
  const selectedCurrency = req.query.selectedcurrency;
  if (!selectedCurrency) {
    res.status(400).json({ error: "Currency not specified" });
    return;
  }

  if (typeof selectedCurrency !== "string") {
    res.status(500).json({ error: "Invalid currency specified" });
    return;
  }

  for (let i = 0; i < cashAccountArrray.length; i += 1) {
    const baseCurr: string = cashAccountArrray[i].account_currency_code;
    const rate = await getFXRateFromDB(baseCurr, selectedCurrency);
    const accountBalConvertedValue: number =
      parseInt(cashAccountArrray[i].account_balance) * rate.currency_fxrate;
    cashAccountArrray[i].accountBalConvertedValue = accountBalConvertedValue;
  }
  res.send(cashAccountArrray);
};

exports.deleteCashAccount = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const deleteRequest = await deleteCashAccountFromDB(req.body.account_id);

  res.send(deleteRequest);
};

exports.deleteProperty = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const deleteRequest = await deletePropertyFromDB(req.body.property_id);

  res.send(deleteRequest);
};

exports.deleteInvestment = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const deleteRequest = await deleteInvestmentFromDB(req.body.holding_id);

  res.send(deleteRequest);
};

exports.updateAccountBalance = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const updateBalanceRequest = updateAccountBalanceToDB(
    req.body.account_id,
    req.body.balance
  ).then((data) => {
    res.send(data);
  });
};

exports.updateSingleInvestment = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const updateBalanceRequest = updateSingleInvestmentToDB(req.body).then(
    (data) => {
      res.send(data);
    }
  );
};

exports.updatePropValue = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  /// REQUIRES USER CHECK?
  const updateBalanceRequest = updatePropValueToDB(
    req.body.property_id,
    req.body.property_valuation,
    req.body.property_loan_value
  ).then((data) => {
    res.send(data);
  });
};

exports.getPropertiesData = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  }

  const selectedCurrency = req.query.selectedcurrency;
  if (!selectedCurrency) {
    res.status(400).json({ error: "Currency not specified" });
    return;
  }

  if (typeof selectedCurrency !== "string") {
    res.status(500).json({ error: "Invalid currency specified" });
    return;
  }

  let selectedOrderBy = req.query.sortby;

  if (typeof selectedOrderBy !== "string") {
    selectedOrderBy = undefined;
  }

  const propertyData = await getPropertyDataFromDB(
    res.locals.currentUser.id,
    selectedOrderBy
  );

  if (!propertyData) {
    res.sendStatus(204);
    return;
  }
  const propertyDataArray = JSON.parse(JSON.stringify(propertyData.properties));

  for (let i = 0; i < propertyDataArray.length; i += 1) {
    const prop_baseCurr: string =
      propertyDataArray[i].property_valuation_currency;
    const prop_rate = await getFXRateFromDB(prop_baseCurr, selectedCurrency);

    const prop_totalConvertedValue: number =
      (parseInt(propertyDataArray[i].property_valuation) -
        parseInt(propertyDataArray[i].property_loan_value)) *
      prop_rate.currency_fxrate;
    propertyDataArray[i].propertyValuationInSelCurr = prop_totalConvertedValue;
  }

  res.send(propertyDataArray);
};

exports.getInvestmentsData = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  }
  const selectedCurrency = req.query.selectedcurrency;
  if (!selectedCurrency) {
    res.status(400).json({ error: "Currency not specified" });
    return;
  }

  if (typeof selectedCurrency !== "string") {
    res.status(500).json({ error: "Invalid currency specified" });
    return;
  }

  const investmentData = await getInvestmentDataFromDB(
    res.locals.currentUser.id
  );

  if (!investmentData) {
    res.sendStatus(204);
    return;
  }

  const investmentsArray = JSON.parse(
    JSON.stringify(investmentData.investments)
  );

  // convert to the currency selected in front end
  for (let i = 0; i < investmentsArray.length; i += 1) {
    const invest_baseCurr: string = investmentsArray[i].holding_currency_code;
    const invest_rate = await getFXRateFromDB(
      invest_baseCurr,
      selectedCurrency
    );

    investmentsArray[i].investmentConvertedValue = 0;
    if (investmentsArray[i].investment_price_histories.length > 0) {
      const pencePrice =
        parseFloat(
          investmentsArray[i].investment_price_histories[0]
            .holding_current_price
        ) / 100;

      const valCalc: number =
        investmentsArray[i].holding_quantity_held * pencePrice;

      const investmentConvertedValue: number =
        valCalc * invest_rate.currency_fxrate;
      investmentsArray[i].investmentConvertedValue = parseInt(
        investmentConvertedValue.toString()
      );
    } else {
      investmentsArray[i].investment_price_histories = [
        {
          holding_current_price: "0",
        },
      ];
    }
  }

  res.send(investmentsArray);
};

exports.getCurrencyData = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  }
  const currencyCodeData = getCurrencyDataFromDB().then((data) => {
    res.send(data);
  });
};

exports.getFXRate = function (req: Request, res: Response, next: NextFunction) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  }
  const currencyFXData = getFXRateFromDB(
    req.body.currencyFrom,
    req.body.currencyTo
  ).then((data) => {
    res.send(data);
  });
};

exports.getallFXRates = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.currentUser) {
    res.sendStatus(403);
    return;
  } else {
    const currencyFXData = getAllFXRatesFromDB().then((data) => {
      res.send(data);
    });
  }
};
