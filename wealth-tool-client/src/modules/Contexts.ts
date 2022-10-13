import { createContext } from "react";
import {
  AssetCountContextCountData,
  currencyCodesAPIData,
} from "../../../types/typeInterfaces";

export const useLoggedInContext = createContext<string | false>(false);

export const useAssetCountContext = createContext<AssetCountContextCountData>({
  "": 0,
});

export const useCurrenciesFromDBContext = createContext<
  Array<currencyCodesAPIData> | undefined
>(undefined);
