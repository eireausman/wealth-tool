import axios from "axios";
import { axiosOptions, stockCompanys } from "../types/typeInterfaces";
import { wereStockCompaniesUpdatedRecently } from "./database_actions";

import {
  getStockMarketsFromDB,
  insertStockCompaniesIntoDB,
  insertStockMarketCodesIntoDB,
} from "./database_actions";

const APIthrottleDelay = (timedelay: number) =>
  new Promise((resolve) => setTimeout(resolve, timedelay));

const updateStockCompaniesListsByMarket = async () => {
  const recentlyUpdated = await wereStockCompaniesUpdatedRecently();
  if (recentlyUpdated === false) {
    try {
      const marketsQuery = await getStockMarketsFromDB();

      const marketsList = JSON.parse(JSON.stringify(marketsQuery));

      for (let item in marketsList) {
        console.log(
          `retrieving company data for market code: ${marketsList[item].exchange_code}`
        );
        const marketCode = marketsList[item].exchange_code;
        retrieveCompaniesDataFromAPI(marketCode);
        await APIthrottleDelay(3000);
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const retrieveCompaniesDataFromAPI = async (marketCode: string) => {
  const APIurl: string = process.env.API_URL_COMPANY_DATA!;
  const APIKey: string = process.env.API_KEY_MARKET_DATA!;
  const APIHost: string = process.env.LINK_KEY_MARKET_DATA!;

  const options: axiosOptions = {
    method: "GET",
    url: APIurl,
    params: { ExchangeCode: marketCode },
    headers: {
      "X-RapidAPI-Key": APIKey,
      "X-RapidAPI-Host": APIHost,
    },
  };

  try {
    const serverRequest = await axios.request(options);
    const companiesByMarket = serverRequest.data.results;

    for (let companyEntry in companiesByMarket) {
      const outcome = await insertStockCompaniesIntoDB(
        companiesByMarket[companyEntry]
      );
    }
    console.log(
      `Completed: Update company info to DB from API request for ${marketCode}`
    );
  } catch (error) {
    console.error(error);
  }
};

export { updateStockCompaniesListsByMarket };
