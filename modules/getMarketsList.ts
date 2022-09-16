import axios from "axios";
import { axiosOptions } from "../types/typeInterfaces";

import { insertStockMarketCodesIntoDB } from "./database_actions";

const updateStockMarketCodes = async () => {
  const APIurl: string = process.env.API_URL_MARKET_DATA!;
  const APIKey: string = process.env.API_KEY_MARKET_DATA!;
  const APIHost: string = process.env.LINK_KEY_MARKET_DATA!;

  const options: axiosOptions = {
    method: "GET",
    url: APIurl,
    headers: {
      "X-RapidAPI-Key": APIKey,
      "X-RapidAPI-Host": APIHost,
    },
  };

  try {
    const serverRequest = await axios.request(options);
    const marketCodes = serverRequest.data.results;

    for (let code in marketCodes) {
      const outcome = await insertStockMarketCodesIntoDB(
        marketCodes[code].exchangeCode
      );
    }
    console.log("Stock Market Codes have been run");
  } catch (error) {
    console.error(error);
  }
};

export { updateStockMarketCodes };
