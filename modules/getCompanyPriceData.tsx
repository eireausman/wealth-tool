import axios from "axios";
import { axiosOptions } from "../types/typeInterfaces";
const { DateTime } = require("luxon");
import {
  getAllHeldStocksFromDB,
  checkIfStockPriceUpdatedWithin,
  updateStockPriceData,
} from "../modules/database_actions";

const getCompanyPriceData = async () => {
  const stockList = await getAllHeldStocksFromDB();

  const stockListArray = JSON.parse(JSON.stringify(stockList));

  const queryNDaysAgoDate = DateTime.now()
    .minus({ days: 7 })
    .toISODate(DateTime.DATE_MED);

  for (let stock in stockListArray) {
    const stockTicker = stockListArray[stock].holding_market_identifier;

    const stockPriceRecentlyUpdated = await checkIfStockPriceUpdatedWithin(
      stockTicker,
      queryNDaysAgoDate
    );

    if (stockPriceRecentlyUpdated === 0) {
      await upsertPriceData(stockTicker);
    }
  }
  console.log("CompanyPriceData update has been run");
};

const APIurl: string = process.env.API_URL_COMPANY_PRICING_DATA!;
const APIKey: string = process.env.API_KEY_MARKET_DATA!;
const APIHost: string = process.env.LINK_KEY_MARKET_DATA!;

const APInDaysAgoDate = DateTime.now()
  .minus({ days: 30 })
  .toISODate(DateTime.DATE_MED);
const today = DateTime.now().toISODate(DateTime.DATE_MED);

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
      for (let priceEntry in stockPricesArray) {
        const outcome = await updateStockPriceData(
          companyTicker,
          stockPricesArray[priceEntry].close.toFixed(6),
          stockPricesArray[priceEntry].date
        );
      }

      console.log("Stock Market Codes have been run");
    } catch (error) {
      console.error(error);
    }
  }
};

export { getCompanyPriceData };
