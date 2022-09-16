import { getCurrencyFXData } from "../modules/serverRequests";

const currencyConvert = async (
  valueFrom: number,
  currencyCodeFrom: string,
  currencyCodeTo: string
) => {
  if (currencyCodeFrom === currencyCodeTo) return valueFrom;
  const serverResponse = await getCurrencyFXData(
    currencyCodeFrom,
    currencyCodeTo
  );
  const convertedNumber = valueFrom * serverResponse.currency_fxrate;
  const rationalisedNumber = parseInt(convertedNumber.toFixed(0));

  return rationalisedNumber;
};

export default currencyConvert;
