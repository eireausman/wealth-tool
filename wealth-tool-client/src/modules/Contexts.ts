import { createContext } from "react";
import { AssetCountContextCountData } from "../../../types/typeInterfaces";

export const LoggedInContext = createContext<string | false>(false);

export const AssetCountContext = createContext<AssetCountContextCountData>({
  "": 0,
});
