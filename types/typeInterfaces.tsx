export interface AddNewCashAccountPropProps {
  currencyCodesFromDB: currencyCodesAPIData[] | undefined;
  setshowAddNewForm: React.Dispatch<React.SetStateAction<boolean>>;
  updatedAllAccountBalances: () => void;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

export interface AddANewInvestmentProps {
  currencyCodesFromDB: currencyCodesAPIData[] | undefined;
  setShowAddNewStockForm: React.Dispatch<React.SetStateAction<boolean>>;
  refreshInvestmentsData: () => void;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

export interface PropertiesNewPropProps {
  currencyCodesFromDB: currencyCodesAPIData[] | undefined;
  setshowAddNewForm: React.Dispatch<React.SetStateAction<boolean>>;
  refreshPropertiesValues: () => void;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

export interface AddNewCashAccountFormData {
  [key: string]: string | number | undefined;
  account_nickname?: string;
  account_number_last4_digits?: number;
  account_owner_name?: string;
  account_balance?: number;
  account_currency_code?: string;
}

export interface reducerState {
  showSearchResultsContainer: boolean;
  showNoResultsFoundMessage: boolean;
  showSelectedStockInfo: boolean;
}

export interface AddNewInvestmentFormData {
  [key: string]: string | number | undefined;
  stockName?: string;
  identifier?: string;
  quantity?: number;
  cost?: number;
  currentPrice?: number;
  ownerName?: string;
  institution?: string;
  currencyCode?: string;
  stockMarket?: string;
}

export interface investmentUpdateStockFormData {
  [key: string]: string | number;
  holding_id: number;
  quantity: number;
  cost: number;
  institution: string;
}

export interface AddNewPropertyFormData {
  [key: string]: string | number | undefined;
  propName?: string;
  propOwner?: string;
  propValue?: number;
  propLoan?: number;
  currencySymbol?: string;
  currencyCode?: string;
}

export interface createAccountFormData {
  [key: string]: string | undefined | boolean;
  username?: string;
  password?: string;
}

export interface userDataInterface {
  users_username?: string;
  users_password?: string;
  users_id?: number;
}

export interface ChartNetWealthCategoriesProps {
  selectedCurrencyCode: string;
  triggerRecalculations: number;
}

export interface passportUser {
  id: number;
  username: string;
}

export interface cashAccountAPIData {
  [key: string]: string | number | undefined;
  account_currency_code: string;
  account_currency_symbol: string;
  account_id: number;
  account_nickname: string;
  account_number_last4_digits: number;
  account_owner_name: string;
  userUsersId: number;
  account_balance: number;
  accountBalConvertedValue: number;
}

export interface allFXRatesAPIData {
  [key: string]: string | number | undefined;
  id: number;
  currency_code_from: string;
  currency_code_to: string;
  currency_fxrate: number;
  currency_fxrate_dateupdated: string;
  virtual_lastUpdatedDay: string;
}

export interface currencyCodesAPIData {
  currency_code: string;
  currency_name: string;
  currency_symbol: string;
  id: number;
}

export interface currencyFXAPIData {
  id: number;
  currency_code_from: string;
  currency_code_from_symbol: string;
  currency_code_to: string;
  currency_code_to_symbol: string;
  currency_fxrate: string;
  currency_fxrate_dateupdated: string;
}

export interface CashAccountsProps {
  selectedCurrencyCode: string;
  selectedCurrencySymbol: string;
  currencyCodesFromDB: currencyCodesAPIData[] | undefined;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

export interface InvestmentsProps {
  selectedCurrencyCode: string;
  selectedCurrencySymbol: string;
  currencyCodesFromDB: currencyCodesAPIData[] | undefined;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

export interface editingPropertyDetails {
  property_id: number;
  property_nickname: string;
  property_valuation: number;
  property_loan_value: number;
  property_valuation_curr_symbol: string;
}

export interface propertiesAPIData {
  [key: string]: string | number | undefined;
  property_id: number;
  property_nickname: string;
  property_owner_name: string;
  property_valuation: number;
  property_loan_value: number;
  property_valuation_currency: string;
  property_valuation_curr_symbol: string;
  propertyValuationInSelCurr: number;
}

export interface OptionsBoardLogoutLinkProps {
  performLogoutAction: () => Promise<void>;
  loggedInUser: string | false;
  windowWidth: number;
  wideWidthLimit: number;
}

export interface OptionsBoardWideProps {
  setCurrency: (e: React.FormEvent<EventTarget>) => void;
  selectedCurrency: string;
  currencyCodesFromDB: currencyCodesAPIData[] | undefined;
  selectedCurrencySymbol: string;
  netWealthValue: number;
  totalPosAssets: number;
  totalDebtValue: number;
  windowWidth: number;
  wideWidthLimit: number;
  performLogoutAction: () => Promise<void>;
  loggedInUser: string | false;
}

export interface OptionsBoardNarrowProps {
  setCurrency: (e: React.FormEvent<EventTarget>) => void;
  selectedCurrency: string;
  currencyCodesFromDB: currencyCodesAPIData[] | undefined;
  selectedCurrencySymbol: string;
  netWealthValue: number;
  totalPosAssets: number;
  totalDebtValue: number;
  windowWidth: number;
  wideWidthLimit: number;
  performLogoutAction: () => Promise<void>;
  loggedInUser: string | false;
}

export interface OptionsBoardNetWealthProps {
  netWealthValue: number;
  selectedCurrencySymbol: string;
}

export interface OptionsBoardTotalAssetsProps {
  selectedCurrencySymbol: string;
  totalPosAssets: number;
}

export interface SoftDeleteButtonProps {
  setshowSoftDelConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SoftDeleteButtonConfirmProps {
  assetType: string;
  assetID: number;
  refreshBalances: () => void;
  triggerRecalculations: number;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  cancelForm: () => void;
}
export interface OptionsBoardTotalDebtProps {
  totalDebtValue: number;
  selectedCurrencySymbol: string;
}

export interface OptionsBoardCurrencySelectProps {
  setCurrency: (e: React.FormEvent<EventTarget>) => void;
  selectedCurrency: string;
  currencyCodesFromDB: currencyCodesAPIData[] | undefined;
  windowWidth: number;
  wideWidthLimit: number;
}

export interface totalsByCurr {
  [key: string]: number;
}

export interface investmentsAPIData {
  [key: string]: string | number | object | undefined;
  holding_cost_total_value: number;
  holding_currency_code: string;
  holding_id: number;
  holding_institution: string;
  holding_market_identifier: string;
  holding_owner_name: string;
  holding_stock_name: string;
  holding_quantity_held: number;
  userUsersId: number;
  investmentConvertedValue: number;
  investment_price_histories: Array<{
    id: number;
    holding_market_identifier: string;
    holding_current_price: string;
    price_asatdate: string;
  }>;
}

export interface PropertiesProps {
  selectedCurrencyCode: string;
  selectedCurrencySymbol: string;
  currencyCodesFromDB: currencyCodesAPIData[] | undefined;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

export interface propertiesUpdateValProps {
  setpropertyToEdit: React.Dispatch<React.SetStateAction<number | undefined>>;
  editingPropertyDetails: editingPropertyDetails | undefined;
  seteditingPropertyDetails: React.Dispatch<
    React.SetStateAction<editingPropertyDetails | undefined>
  >;
  refreshPropertiesValues: () => Promise<void>;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

export interface CashAccountUpdateBalProps {
  data: cashAccountAPIData;
  setShowEditAccountForm: React.Dispatch<React.SetStateAction<boolean>>;
  updatedAllAccountBalances: () => void;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

export interface InvestmentsUpdateStockProps {
  data: investmentsAPIData;
  setshowEditStockForm: React.Dispatch<React.SetStateAction<boolean>>;
  refreshInvestmentsData: () => void;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

export interface LoginAttemptFormData {
  [key: string]: string | undefined;
  username?: string;
  password?: string;
}

export interface createAccountServerResponse {
  requestOutcome?: boolean;
  message?: string;
}

export interface LoginAttemptServerResponse {
  requestOutcome?: boolean;
  message?: string;
}

export interface axiosOptions {
  method: string;
  url: string;
  params?: { [key: string]: string };
  headers: {
    [key: string]: string;
  };
}

export interface companyNameSearchResults {
  [key: string]: string | number | object;
  id: number;
  exchange_code: string;
  company_symbol: string;
  company_name: string;
  industry_or_category: string;
  entry_dateupdated: string;
  stock_market: {
    exchange_code: string;
    exchange_currency_code: string;
    exchange_name: string;
    id: number;
    currencies_code: {
      currency_code: string;
      currency_name: string;
      currency_symbol: string;
      id: number;
    };
  };
}

export interface InvestmentAddStockNameProps {
  updateFormDataState: (e: React.FormEvent<EventTarget>) => void;
  newStockNameSelectedFromSearch: (
    selectedCompany: companyNameSearchResults
  ) => void;
  formData: AddNewInvestmentFormData | undefined;
  resetCompanyFormData: () => void;
}

export interface stockCompanys {
  [key: string]: string;
  exchangeCode: string;
  companyName: string;
  industryOrCategory: string;
  entry_dateupdated: string;
  symbol: string;
}

export interface OptionsBoardProps {
  selectedCurrencyCode: string;
  selectedCurrencySymbol: string;
  setselectedCurrencyCode: React.Dispatch<React.SetStateAction<string>>;
  currencyCodesFromDB: currencyCodesAPIData[] | undefined;
  setselectedCurrencySymbol: React.Dispatch<React.SetStateAction<string>>;
  loggedInUser: string | false;
  setloggedInUser: React.Dispatch<React.SetStateAction<string | false>>;
  triggerRecalculations: number;
}

export interface CashAccountAccRowProps {
  data: cashAccountAPIData;
  selectedCurrencySymbol: string;
  updatedAllAccountBalances: () => void;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

export interface InvestmentRowProps {
  data: investmentsAPIData;
  selectedCurrencySymbol: string;
  refreshInvestmentsData: () => void;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}
