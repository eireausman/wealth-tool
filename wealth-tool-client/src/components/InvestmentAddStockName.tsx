import React, { Fragment, useState, useReducer } from "react";
import {
  InvestmentAddStockNameProps,
  companyNameSearchResults,
  reducerState,
} from "../../../types/typeInterfaces";

import { getCompanyStockByName } from "../modules/serverRequests";
import CardSpinner from "./CardSpinner";
import "./InvestmentAddStockName.css";
import InvestmentAddStockNameSelected from "./InvestmentAddStockNameSelected";

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

  const getStockName = async (e: React.FormEvent<EventTarget>) => {
    // search for the string:

    const target = e.target as HTMLInputElement;
    const targetValue = target.value;

    if (targetValue.length > 2) {
      dispatch({ type: "initialSearchCommenced" });
      const serverResponse = await getCompanyStockByName(targetValue);
      console.log(serverResponse);
      if (serverResponse.length === 0) {
        dispatch({ type: "emptyCompaniesListReceived" });
      } else {
        dispatch({ type: "companiesListReceived" });
        setcompanyNameSearchResults(serverResponse);
      }
    }
  };

  const selectThisCompany = (item: companyNameSearchResults) => {
    console.log(item);

    newStockNameSelectedFromSearch(item);
    dispatch({ type: "companiesListEntrySelected" });
  };

  return (
    <Fragment>
      {state.showSelectedStockInfo === false && (
        <label className="newStockInputRow">
          Stock Name
          <input
            name="stockName"
            className="newStockInputField"
            type="text"
            required
            minLength={3}
            maxLength={40}
            onChange={getStockName}
          />
        </label>
      )}
      {state.showSearchResultsContainer === true && (
        <div className="stockNameSearchResultContainer">
          {companyNameSearchResults === undefined && (
            <CardSpinner cardTitle="" />
          )}
          {state.showNoResultsFoundMessage === false &&
            companyNameSearchResults?.map((item) => (
              <div
                className="companyNameLink"
                onClick={() => selectThisCompany(item)}
                key={item.id}
              >
                {item.company_name}
              </div>
            ))}
        </div>
      )}
      {state.showSelectedStockInfo === true && (
        <div className="selectedStockData">
          <InvestmentAddStockNameSelected
            formData={formData}
            dispatch={dispatch}
            resetCompanyFormData={resetCompanyFormData}
          />
        </div>
      )}
      {state.showNoResultsFoundMessage === true && (
        <div className="stockNameSearchResultContainer">No results found</div>
      )}
    </Fragment>
  );
};

export default InvestmentAddStockName;
