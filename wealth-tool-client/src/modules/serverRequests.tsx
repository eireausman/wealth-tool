import axios from "axios";
import {
  createAccountFormData,
  AddNewInvestmentFormData,
  AddNewPropertyFormData,
  AddNewCashAccountFormData,
} from "../../../types/typeInterfaces";

const addnewinvestment = async (formData: AddNewInvestmentFormData) => {
  try {
    const serverResponse = await axios.post("/api/addnewinvestment", formData);
    return await serverResponse.data;
  } catch (error) {
    console.error(error);
  }
};

const refreshSingleStockPricingData = async (
  formData: AddNewInvestmentFormData
) => {
  try {
    const serverResponse = await axios.post(
      "/api/refreshsinglestockpricingdata",
      formData
    );
    return await serverResponse.data;
  } catch (error) {
    console.error(error);
  }
};

const addNewCashAccount = async (formData: AddNewCashAccountFormData) => {
  try {
    const serverResponse = await axios.post("/api/addnewcashaccount", formData);
    return await serverResponse.data;
  } catch (error) {
    console.error(error);
  }
};

const logUserOut = async () => {
  try {
    const serverResponse = await axios.get("/api/logout");
    return await serverResponse.data;
  } catch (error) {
    console.error(error);
  }
};

const checkifuserloggedin = async () => {
  try {
    const serverResponse = await axios.get("/api/isuserloggedin");
    return await serverResponse.data;
  } catch (error) {
    console.error(error);
  }
};

const usersAssetCount = async () => {
  try {
    const serverResponse = await axios.get("/api/usersassetcount");
    return await serverResponse.data;
  } catch (error) {
    console.error(error);
  }
};

const addNewProperty = async (formData: AddNewPropertyFormData) => {
  try {
    const serverResponse = await axios.post("/api/addnewproperty", formData);
    return await serverResponse.data;
  } catch (error) {
    console.error(error);
  }
};

const createAccountAttempt = async (formData: createAccountFormData) => {
  try {
    const serverResponse = await axios.post("/api/createaccount", formData);
    return await serverResponse.data;
  } catch (error) {
    console.error(error);
  }
};

const loginAttempt = async (formData: createAccountFormData) => {
  try {
    const serverResponse = await axios.post("/api/login", formData);
    return await serverResponse.data;
  } catch (error) {
    console.error(error);
  }
};

const getCurrencyCodeData = async () => {
  try {
    const serverResponse = await axios.get("/api/getcurrencycodes");
    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const getAllFXRateData = async () => {
  try {
    const serverResponse = await axios.get("/api/getallfxrates");
    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const getCurrencyFXData = async (currencyFrom: string, currencyTo: string) => {
  const formData = {
    currencyFrom,
    currencyTo,
  };
  try {
    const serverResponse = await axios.post("/api/getfxrates", formData);

    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const getPropertiesData = async (
  selectedCurrency: string,
  sortByField: string
) => {
  try {
    const serverResponse = await axios.get(
      `/api/getpropertiesdata?selectedcurrency=${selectedCurrency}&sortby=${sortByField}`
    );
    return await serverResponse;
  } catch (err) {
    console.error(err);
  }
};

const getSinglePropertyData = async (
  selectedCurrency: string,
  propertyID: number
) => {
  try {
    const serverResponse = await axios.get(
      `/api/getsinglepropertydata?selectedcurrency=${selectedCurrency}&propertyID=${propertyID}`
    );
    return await serverResponse;
  } catch (err) {
    console.error(err);
  }
};

const getSingleCashAccountData = async (
  selectedCurrency: string,
  cashAccountID: number
) => {
  try {
    const serverResponse = await axios.get(
      `/api/getsinglecashaccountdata?selectedcurrency=${selectedCurrency}&cashaccountid=${cashAccountID}`
    );

    return await serverResponse;
  } catch (err) {
    console.error(err);
  }
};

const getCashAccountData = async (
  selectedCurrency: string,
  sortByField: string
) => {
  try {
    const serverResponse = await axios.get(
      `/api/getcashaccountdata?selectedcurrency=${selectedCurrency}&sortby=${sortByField}`
    );

    return await serverResponse;
  } catch (err) {
    console.error(err);
  }
};

const getNetCashAccountTotal = async (selectedCurrency: string) => {
  try {
    const serverResponse = await axios.get(
      `/api/getcashaccountnettotal?selectedcurrency=${selectedCurrency}`
    );

    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const getNetPropertyTotal = async (selectedCurrency: string) => {
  try {
    const serverResponse = await axios.get(
      `/api/getpropertynettotal?selectedcurrency=${selectedCurrency}`
    );

    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const getNetInvestmentTotal = async (selectedCurrency: string) => {
  try {
    const serverResponse = await axios.get(
      `/api/getinvestmentsnettotal?selectedcurrency=${selectedCurrency}`
    );

    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const updateCashAccountBalance = async (
  account_id: number,
  balance: number
) => {
  const formData = {
    account_id,
    balance,
  };
  try {
    const serverResponse = await axios.post(
      "/api/updatecashaccountbalance",
      formData
    );
    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const getTotalPosAssets = async (selectedCurrency: string) => {
  try {
    const serverResponse = await axios.get(
      `/api/gettotalposassets?selectedcurrency=${selectedCurrency}`
    );

    return await serverResponse;
  } catch (err) {
    console.error(err);
  }
};

const deleteCashAccount = async (id: number) => {
  try {
    // post as soft delete rather than full db removal of record
    const serverResponse = await axios.post(`/api/deletecashaccount`, {
      account_id: id,
    });

    return await serverResponse;
  } catch (err) {
    console.error(err);
  }
};

const deleteProperty = async (id: number) => {
  try {
    // post as soft delete rather than full db removal of record
    const serverResponse = await axios.post(`/api/deleteproperty`, {
      property_id: id,
    });

    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const deleteInvestment = async (id: number) => {
  try {
    // post as soft delete rather than full db removal of record
    const serverResponse = await axios.post(`/api/deleteinvestment`, {
      holding_id: id,
    });

    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const getTotalDebtValue = async (selectedCurrency: string) => {
  try {
    const serverResponse = await axios.get(
      `/api/getdebttotalvalue?selectedcurrency=${selectedCurrency}`
    );

    return await serverResponse;
  } catch (err) {
    console.error(err);
  }
};

const getCompanyStockByName = async (searchString: string) => {
  try {
    const serverResponse = await axios.get(
      `/api/searchforcompanybyname?searchstring=${searchString}`
    );

    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const updateInvestmentData = async (
  holding_id: number,
  cost: number,
  institution: string,
  quantity: number
) => {
  const formData = {
    holding_id,
    cost,
    institution,
    quantity,
  };
  try {
    const serverResponse = await axios.post(
      "/api/updatesingleinvestment",
      formData
    );
    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const updatePropertyValue = async (
  property_id: number,
  property_valuation: number,
  property_loan_value: number
) => {
  const formData = {
    property_id,
    property_valuation,
    property_loan_value,
  };
  try {
    const serverResponse = await axios.post(
      "/api/updatepropertyvalue",
      formData
    );
    return await serverResponse.data;
  } catch (err) {
    console.error(err);
  }
};

const getInvestmentData = async (
  selectedCurrency: string,
  sortByField: string
) => {
  try {
    const serverResponse = await axios.get(
      `/api/getinvestmentdata?selectedcurrency=${selectedCurrency}&sortby=${sortByField}`
    );

    return await serverResponse;
  } catch (err) {
    console.error(err);
  }
};

const getSingleInvestmentData = async (
  selectedCurrency: string,
  holdingID: number
) => {
  try {
    const serverResponse = await axios.get(
      `/api/getsingleinvestmentdata?selectedcurrency=${selectedCurrency}&holdingID=${holdingID}`
    );

    return await serverResponse;
  } catch (err) {
    console.error(err);
  }
};

export {
  getSingleInvestmentData,
  getSinglePropertyData,
  createAccountAttempt,
  loginAttempt,
  getCashAccountData,
  updateCashAccountBalance,
  getPropertiesData,
  getCurrencyFXData,
  getCurrencyCodeData,
  updatePropertyValue,
  getInvestmentData,
  addnewinvestment,
  addNewProperty,
  addNewCashAccount,
  getTotalPosAssets,
  getTotalDebtValue,
  getAllFXRateData,
  getNetCashAccountTotal,
  getNetPropertyTotal,
  getNetInvestmentTotal,
  checkifuserloggedin,
  logUserOut,
  getCompanyStockByName,
  updateInvestmentData,
  deleteCashAccount,
  deleteProperty,
  deleteInvestment,
  refreshSingleStockPricingData,
  usersAssetCount,
  getSingleCashAccountData,
};
