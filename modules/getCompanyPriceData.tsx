import axios, { AxiosError } from "axios";
import { axiosOptions } from "../types/typeInterfaces";
const { DateTime } = require("luxon");
import {
  getAllHeldStocksFromDB,
  checkIfStockPriceUpdatedWithin,
  updateStockPriceData,
  updateLastAPIPriceingAttemptDate,
} from "../modules/database_actions";

const APInDaysAgoDate = DateTime.now()
  .minus({ days: 30 })
  .toISODate(DateTime.DATE_MED);
const today = DateTime.now().toISODate(DateTime.DATE_MED);

const getCompanyPriceData = async (companyTicker?: string) => {
  const APIthrottleDelay = (timedelay: number) =>
    new Promise((resolve) => setTimeout(resolve, timedelay));

  const queryNDaysAgoDate = DateTime.now()
    .minus({ days: 7 })
    .toISODate(DateTime.DATE_MED);

  if (companyTicker === undefined) {
    const stockList = await getAllHeldStocksFromDB(today);

    const stockListArray = JSON.parse(JSON.stringify(stockList));

    for (let stock in stockListArray) {
      const stockTicker = stockListArray[stock].holding_market_identifier;
      const stockPriceRecentlyUpdated = await checkIfStockPriceUpdatedWithin(
        stockTicker,
        queryNDaysAgoDate
      );

      if (stockPriceRecentlyUpdated === 0) {
        await upsertPriceData(stockTicker);
        await APIthrottleDelay(1500);
      }
    }
  } else {
    const stockPriceRecentlyUpdated = await checkIfStockPriceUpdatedWithin(
      companyTicker,
      queryNDaysAgoDate
    );
    if (stockPriceRecentlyUpdated === 0) {
      await upsertPriceData(companyTicker);
      await APIthrottleDelay(1500);
    }
  }
  console.log("CompanyPriceData update has been run");
  return "CompanyPriceData update has been run";
};

const APIurl: string = process.env.API_URL_COMPANY_PRICING_DATA!;
const APIKey: string = process.env.API_KEY_MARKET_DATA!;
const APIHost: string = process.env.LINK_KEY_MARKET_DATA!;

const upsertPriceData = async (companyTicker: string) => {
  const options: axiosOptions = {
    method: "GET",
    url: APIurl,
    params: {
      EndDateInclusive: today,
      StartDateInclusive: APInDaysAgoDate,
      Symbol: companyTicker,
      OrderBy: "Ascending",
    },
    headers: {
      "X-RapidAPI-Key": APIKey,
      "X-RapidAPI-Host": APIHost,
    },
  };

  if (process.env.API_TRIGGEREDCALLS_SWITCH === "ON") {
    try {
      const serverRequest = await axios.request(options);
      const stockPricesArray = serverRequest.data.results;
      console.log(stockPricesArray, companyTicker);
      for (let priceEntry in stockPricesArray) {
        const outcome = await updateStockPriceData(
          companyTicker,
          stockPricesArray[priceEntry].close.toFixed(6),
          stockPricesArray[priceEntry].date
        );
      }
      await updateLastAPIPriceingAttemptDate(companyTicker, today);
    } catch (error) {
      console.error(error);
      // add a zero price for this stock as likely suspended / no prices available
      await updateLastAPIPriceingAttemptDate(companyTicker, today);
      console.log(`** ${companyTicker} ** price not avaialble via API `);
    }
  }
};

export { getCompanyPriceData };
