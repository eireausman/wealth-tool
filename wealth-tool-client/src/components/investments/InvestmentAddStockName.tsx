import React, {
  Fragment,
  useState,
  useReducer,
  useEffect,
  useRef,
} from "react";
import {
  InvestmentAddStockNameProps,
  companyNameSearchResults,
  reducerState,
} from "../../../../types/typeInterfaces";

import { getCompanyStockByName } from "../../modules/serverRequests";
import CardSpinner from "../loaders/CardSpinner";
import styles from "./InvestmentAddStockName.module.css";
import InvestmentAddStockNameSelected from "./InvestmentAddStockNameSelected";
import { BsSearch } from "react-icons/bs";
import useDebounce from "../../hooks/useDebounce";

const initialState = {
  showSearchResultsContainer: false,
  showNoResultsFoundMessage: false,
  showSelectedStockInfo: false,
};

function reducer(state: reducerState, action: any) {
  switch (action.type) {
    case "initialSearchCommenced":
      return {
        showSearchResultsContainer: true,
        showNoResultsFoundMessage: false,
        showSelectedStockInfo: false,
      };
    case "emptyCompaniesListReceived":
      return {
        showSearchResultsContainer: false,
        showNoResultsFoundMessage: true,
        showSelectedStockInfo: false,
      };
    case "companiesListReceived":
      return {
        showSearchResultsContainer: true,
        showNoResultsFoundMessage: false,
        showSelectedStockInfo: false,
      };
    case "companiesListEntrySelected":
      return {
        showSearchResultsContainer: false,
        showNoResultsFoundMessage: false,
        showSelectedStockInfo: true,
      };
    case "resetSearch":
      return {
        showSearchResultsContainer: false,
        showNoResultsFoundMessage: false,
        showSelectedStockInfo: false,
      };
    default:
      throw new Error();
  }
}

const InvestmentAddStockName: React.FC<InvestmentAddStockNameProps> = ({
  updateFormDataState,
  newStockNameSelectedFromSearch,
  formData,
  resetCompanyFormData,
}) => {
  const [companyNameSearchResults, setcompanyNameSearchResults] =
    useState<Array<companyNameSearchResults>>();

  const [state, dispatch] = useReducer(reducer, initialState);

  const stockNameNameInputBox = useRef<HTMLInputElement | null>(null);
  const [stockNameInput, setstockNameInput] = useState<string>("");

  useEffect(() => {
    stockNameNameInputBox.current !== null &&
      stockNameNameInputBox.current.focus();
  }, []);

  const searchTerm = useDebounce(stockNameInput, 500);
  useEffect(() => {
    if (searchTerm) {
      getStockName();
    }
  }, [searchTerm]);

  const getStockName = async () => {
    if (stockNameInput.length > 2) {
      dispatch({ type: "initialSearchCommenced" });
      const serverResponse = await getCompanyStockByName(stockNameInput);

      if (serverResponse.length === 0) {
        dispatch({ type: "emptyCompaniesListReceived" });
      } else {
        dispatch({ type: "companiesListReceived" });
        setcompanyNameSearchResults(serverResponse);
      }
    }
  };

  const selectThisCompany = (item: companyNameSearchResults) => {
    newStockNameSelectedFromSearch(item);
    dispatch({ type: "companiesListEntrySelected" });
  };

  return (
    <Fragment>
      {state.showSelectedStockInfo === false && (
        <label className={`${styles.newStockInputRow}`}>
          <BsSearch /> Stock Name
          <input
            name="stockName"
            className={styles.newStockInputField}
            ref={stockNameNameInputBox}
            value={stockNameInput}
            type="text"
            required
            minLength={3}
            maxLength={40}
            onChange={(e) => setstockNameInput(e.target.value)}
          />
        </label>
      )}
      {state.showSearchResultsContainer === true && (
        <div className={styles.stockNameSearchResultContainer}>
          {companyNameSearchResults === undefined && (
            <CardSpinner cardTitle="" />
          )}
          {state.showNoResultsFoundMessage === false &&
            companyNameSearchResults?.map((item) => (
              <div
                className={styles.companyNameLink}
                onClick={() => selectThisCompany(item)}
                key={item.id}
              >
                {item.company_name}
              </div>
            ))}
        </div>
      )}
      {state.showSelectedStockInfo === true && (
        <div className={styles.selectedStockData}>
          <InvestmentAddStockNameSelected
            formData={formData}
            dispatch={dispatch}
            resetCompanyFormData={resetCompanyFormData}
          />
        </div>
      )}
      {state.showNoResultsFoundMessage === true && (
        <div className={styles.stockNameSearchResultContainer}>
          No results found
        </div>
      )}
    </Fragment>
  );
};

export default InvestmentAddStockName;
