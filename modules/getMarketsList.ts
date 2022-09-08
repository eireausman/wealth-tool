import axios from "axios";

interface axiosOptions {
  method: string;
  url: string;
  headers: {
    [key: string]: string;
  };
}

const updateStockMarkets = async () => {
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

  axios
    .request(options)
    .then(function (response) {
      const data = response.data;
      // console.log(response.data);
      data.forEach((item: string) => {
        console.log(item);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
};

export default updateStockMarkets;
