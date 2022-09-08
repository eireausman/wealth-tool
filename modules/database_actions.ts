import { SequelizeMethod } from "sequelize/types/utils";
import {
  AddNewCashAccountFormData,
  AddNewInvestmentFormData,
  AddNewPropertyFormData,
} from "../types/typeInterfaces";

const { DateTime } = require("luxon");
const { Op } = require("sequelize");
const { sequelize } = require("./database_connect");

// logging: console.log,
const User = require("../models/user")(sequelize);
const CashAccount = require("../models/cashAccounts")(sequelize);
const CashAccountBalances = require("../models/cashAccountsBalances")(
  sequelize
);
const Properties = require("../models/Properties")(sequelize);
const Currencies = require("../models/currencies_fx")(sequelize);
const CurrencyCodes = require("../models/currencies_codes")(sequelize);
const PropertiesHistVals = require("../models/PropertiesHistVals")(sequelize);
const Investments = require("../models/investments")(sequelize);
const InvestmentPriceHistory = require("../models/investment_price_history")(
  sequelize
);
const stockMarkets = require("../models/stock_markets")(sequelize);

User.hasMany(CashAccount, { foreignKey: "userUsersId" });
User.hasMany(Investments, { foreignKey: "userUsersId" });
CashAccount.belongsTo(User, { foreignKey: "userUsersId" });
Investments.belongsTo(User, { foreignKey: "userUsersId" });
InvestmentPriceHistory.belongsTo(Investments, { foreignKey: "holding_id" });
User.hasMany(Properties, { foreignKey: "userUsersId" });

CashAccount.hasMany(CashAccountBalances, { foreignKey: "account_id" });
Properties.hasMany(PropertiesHistVals, { foreignKey: "property_id" });
Investments.hasMany(InvestmentPriceHistory, { foreignKey: "holding_id" });

CashAccountBalances.belongsTo(CashAccount, { foreignKey: "account_id" });
PropertiesHistVals.belongsTo(Properties, { foreignKey: "property_id" });
Properties.belongsTo(User, { foreignKey: "userUsersId" });

User.sync();
CashAccount.sync();
CashAccountBalances.sync();
Properties.sync();
Currencies.sync();
CurrencyCodes.sync();
PropertiesHistVals.sync();
Investments.sync();
InvestmentPriceHistory.sync();
stockMarkets.sync();

export async function addNewCashAccountToDB(
  userID: number,
  requestBody: AddNewCashAccountFormData
) {
  try {
    const newCashAccountEntry = await CashAccount.create({
      userUsersId: userID,
      account_nickname: requestBody.account_nickname,
      account_number_last4_digits: requestBody.account_number_last4_digits,
      account_owner_name: requestBody.account_owner_name,
      account_balance: requestBody.account_balance,
      account_currency_code: requestBody.account_currency_code,
      account_currency_symbol: requestBody.account_currency_symbol,
    });
    const saveResult = await newCashAccountEntry.save();

    const accountID = await saveResult.dataValues.account_id;
    const today = new Date();
    const newCashAccountHistoryEntry = await CashAccountBalances.create({
      account_id: accountID,
      account_balance: requestBody.account_balance,
      account_balance_asatdate: today,
    });
    await newCashAccountHistoryEntry.save();
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function addNewInvestmentToDB(
  userID: number,
  requestBody: AddNewInvestmentFormData
) {
  try {
    const newInvestmentEntry = await Investments.create({
      userUsersId: userID,
      holding_owner_name: requestBody.ownerName,
      holding_stock_name: requestBody.stockName,
      holding_institution: requestBody.institution,
      holding_market_identifier: requestBody.identifier,
      holding_currency_code: requestBody.currencyCode,
      holding_currency_symbol: requestBody.currencySymbol,
      holding_quantity_held: requestBody.quantity,
      holding_current_price: requestBody.currentPrice,
      holding_cost_total_value: requestBody.cost,
    });
    const saveResult = await newInvestmentEntry.save();

    const holdingID = saveResult.dataValues.holding_id;
    const today = new Date();
    const newInvestmentPriceHistoryEntry = await InvestmentPriceHistory.create({
      holding_id: holdingID,
      holding_current_price: requestBody.currentPrice,
      price_asatdate: today,
    });
    await newInvestmentPriceHistoryEntry.save();
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function addNewPropertyToDB(
  userID: number,
  requestBody: AddNewPropertyFormData
) {
  try {
    const newPropEntry = await Properties.create({
      userUsersId: userID,
      property_nickname: requestBody.property_nickname,
      property_owner_name: requestBody.property_owner_name,
      property_valuation: requestBody.property_valuation,
      property_loan_value: requestBody.property_loan_value,
      property_valuation_currency: requestBody.currencyCode,
      property_valuation_curr_symbol: requestBody.currencySymbol,
    });
    const saveResult = await newPropEntry.save();

    const propID = await saveResult.dataValues.property_id;
    const today = new Date();
    const newPropValHistoryEntry = await PropertiesHistVals.create({
      property_id: propID,
      property_valuation: requestBody.property_valuation,
      property_loan_value: requestBody.property_loan_value,
      property_value_asatdate: today,
    });
    await newPropValHistoryEntry.save();
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function findAllUsers() {
  const users = await User.findAll();
}

export async function findOneUser(
  search_fieldname: string,
  received_search_term: string
) {
  try {
    const users = await User.findOne({
      attributes: ["users_id", "users_username", "users_password"],
      where: {
        [search_fieldname]: received_search_term,
      },
    });

    return {
      users,
    };
  } catch (error) {
    return error;
  }
}

export async function createUser(sent_username: string, sent_password: string) {
  const userExists = await findOneUser("users_username", sent_username);
  console.log(userExists);

  if (userExists === false) {
    try {
      const userAccount = await User.create({
        users_username: sent_username,
        users_password: sent_password,
      });

      await userAccount.save();

      const message = {
        requestOutcome: true,
        message: "Account created.",
      };
      return message;
    } catch (err) {
      return err;
    }
  }
  const message = {
    requestOutcome: false,
    message: `Error: Account ${sent_username} already exists.`,
  };
  return message;

  // 'catch' appears to be resolved by sequelize
}

export async function getCurrencyDataFromDB() {
  try {
    const currenciesCodesQuery = await CurrencyCodes.findAll({
      order: [["currency_name", "ASC"]],
    });
    return currenciesCodesQuery;
  } catch (error) {
    return error;
  }
}

export async function getAllFXRatesFromDB() {
  try {
    const currenciesQuery = await Currencies.findAll({
      order: [["currency_code_from", "ASC"]],
    });

    // have to stringify query to retrieve virtuals and then convert back to JS to convey to Front End
    const JSONoutput = JSON.stringify(currenciesQuery, null, 2);
    const queryOutputArray = JSON.parse(JSONoutput);

    return queryOutputArray;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getFXRateFromDB(from: string, to: string) {
  try {
    const currenciesQuery = await Currencies.findOne({
      where: {
        currency_code_from: from,
        currency_code_to: to,
      },
      order: [["currency_fxrate_dateupdated", "DESC"]],
    });

    return await currenciesQuery.dataValues;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function insertFXRateIntoDB(
  fromCurrency: string,
  toCurrency: string,
  fxRate: number
) {
  const today = new Date();
  try {
    const checkifExists = await Currencies.count({
      where: { currency_code_from: fromCurrency, currency_code_to: toCurrency },
    });

    if ((await checkifExists) === 0) {
      const newCurrency = await Currencies.create({
        currency_code_from: fromCurrency,
        currency_code_to: toCurrency,
        currency_fxrate: fxRate,
        currency_fxrate_dateupdated: today,
      });

      await newCurrency.save();
    } else {
      await Currencies.update(
        {
          currency_fxrate: fxRate,
          currency_fxrate_dateupdated: today,
        },
        {
          where: {
            currency_code_from: fromCurrency,
            currency_code_to: toCurrency,
          },
        }
      );
    }
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function wereRatesUpdatedRecently() {
  const nDaysAgoDate = DateTime.now()
    .minus({ days: 1 })
    .toISODate(DateTime.DATE_MED);

  try {
    const RatesUpdatedRecently = await Currencies.count({
      where: {
        currency_fxrate_dateupdated: {
          [Op.gt]: nDaysAgoDate,
        },
      },
    });

    if (RatesUpdatedRecently > 0) return true;
    // 0 = rates were recently updated.
    return false;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function updateAccountBalanceToDB(
  accountID: number,
  balance: number
) {
  const today = new Date();
  try {
    const entryExistsCheck = await CashAccountBalances.count({
      where: { account_id: accountID, account_balance_asatdate: today },
    });

    if (entryExistsCheck === 0) {
      const newCashAccountBalances = await CashAccountBalances.create({
        account_id: accountID,
        account_balance: balance,
        account_balance_asatdate: today,
      });

      await newCashAccountBalances.save();
    } else {
      await CashAccountBalances.update(
        {
          account_id: accountID,
          account_balance: balance,
        },
        {
          where: { account_id: accountID, account_balance_asatdate: today },
        }
      );
    }
    // update the parent record to reflect the latest value (for querying ease)
    await CashAccount.update(
      {
        account_balance: balance,
      },
      {
        where: { account_id: accountID },
      }
    );
  } catch (err) {
    return err;
  }
}

export async function getPropertyDataFromDB(reslocalsuser: string) {
  try {
    const usersPropertyDataQuery = await User.findOne({
      attributes: ["users_id"],
      where: {
        users_id: reslocalsuser,
      },
      include: {
        model: Properties,
        where: {
          soft_deleted: 0,
        },
      },
    });

    return usersPropertyDataQuery;
  } catch (err) {
    return err;
  }
}

export async function getInvestmentDataFromDB(reslocalsuser: string) {
  try {
    const usersInvestmentQuery = await User.findOne({
      attributes: ["users_id"],
      order: [
        [Investments, "holding_owner_name", "ASC"],
        [Investments, "holding_stock_name", "ASC"],
      ],
      where: {
        users_id: reslocalsuser,
      },
      include: {
        model: Investments,
        where: {
          soft_deleted: 0,
        },
      },
    });

    return await usersInvestmentQuery;
  } catch (err) {
    return err;
  }
}

export async function getPosInvestmentTotalsByCurrency(reslocalsuser: string) {
  try {
    const usersInvestmentData = await User.findOne({
      group: ["holding_currency_code"],
      where: {
        users_id: reslocalsuser,
      },
      include: {
        model: Investments,

        where: {
          soft_deleted: 0,
          holding_current_price: {
            [Op.gt]: 0,
          },
          holding_quantity_held: {
            [Op.gt]: 0,
          },
        },

        attributes: [
          "holding_currency_code",

          [
            sequelize.literal(
              "SUM(COALESCE(holding_current_price, 0) * COALESCE(holding_quantity_held, 0))"
            ),
            "total",
          ],
        ],
      },
    });
    return await usersInvestmentData;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getDebtCashAccountTotalsByCurrency(
  reslocalsuser: string
) {
  try {
    const usersCashAccountData = await User.findOne({
      group: ["account_currency_code"],
      where: {
        users_id: reslocalsuser,
      },
      include: {
        model: CashAccount,
        where: {
          soft_deleted: 0,
          account_balance: {
            [Op.lt]: 0,
          },
        },
        attributes: [
          "account_currency_code",
          [sequelize.fn("sum", sequelize.col("account_balance")), "total"],
        ],
      },
    });
    return await usersCashAccountData;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getDebtPropertyTotalsByCurrency(reslocalsuser: string) {
  try {
    const usersPropertyValueData = await User.findOne({
      group: ["property_valuation_currency"],
      where: {
        users_id: reslocalsuser,
      },
      include: {
        model: Properties,

        where: {
          soft_deleted: 0,
        },

        attributes: [
          "property_valuation_currency",
          [
            sequelize.fn("sum", sequelize.col("property_loan_value")),
            "totalPositiveNumber",
          ],
          [
            sequelize.literal("SUM(COALESCE(property_loan_value, 0) * -1)"),
            "total",
          ],
        ],
      },
    });
    return await usersPropertyValueData;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getPosCashAccountTotalsByCurrency(reslocalsuser: string) {
  try {
    const usersCashAccountData = await User.findOne({
      group: ["account_currency_code"],
      where: {
        users_id: reslocalsuser,
      },
      include: {
        model: CashAccount,
        where: {
          soft_deleted: 0,
          account_balance: {
            [Op.gt]: 0,
          },
        },
        attributes: [
          "account_currency_code",
          [sequelize.fn("sum", sequelize.col("account_balance")), "total"],
        ],
      },
    });
    return await usersCashAccountData;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getPosPropertyTotalsByCurrency(reslocalsuser: string) {
  try {
    const usersPropertyValueData = await User.findOne({
      group: ["property_valuation_currency"],
      where: {
        users_id: reslocalsuser,
      },
      include: {
        model: Properties,

        where: {
          soft_deleted: 0,
        },

        attributes: [
          "property_valuation_currency",
          [sequelize.fn("sum", sequelize.col("property_valuation")), "total"],
        ],
      },
    });
    return await usersPropertyValueData;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getNetCashAccountTotalsByCurrency(reslocalsuser: string) {
  try {
    const usersCashAccountData = await User.findOne({
      group: ["account_currency_code"],
      where: {
        users_id: reslocalsuser,
      },
      include: {
        model: CashAccount,
        where: {
          soft_deleted: 0,
        },
        attributes: [
          "account_currency_code",
          [sequelize.fn("sum", sequelize.col("account_balance")), "total"],
        ],
      },
    });
    return await usersCashAccountData;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getNetPropertyTotalsByCurrency(reslocalsuser: string) {
  try {
    const usersPropertyValueData = await User.findOne({
      group: ["property_valuation_currency"],
      where: {
        users_id: reslocalsuser,
      },
      include: {
        model: Properties,

        where: {
          soft_deleted: 0,
        },

        attributes: [
          "property_valuation_currency",
          [
            sequelize.literal(
              "SUM(COALESCE(property_valuation, 0) - COALESCE(property_loan_value, 0))"
            ),
            "total",
          ],
        ],
      },
    });
    return await usersPropertyValueData;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function updatePropValueToDB(
  propID: number,
  propVal: number,
  propLoanVal: number
) {
  const today = new Date();
  try {
    const entryExistsCheck = await PropertiesHistVals.count({
      where: {
        property_value_asatdate: today,
        property_id: propID,
      },
    });

    if (entryExistsCheck === 0) {
      const newPropValues = await PropertiesHistVals.create({
        property_id: propID,
        property_valuation: propVal,
        property_loan_value: propLoanVal,
        property_value_asatdate: today,
      });

      await newPropValues.save();
    } else {
      await PropertiesHistVals.update(
        {
          property_id: propID,
          property_valuation: propVal,
          property_loan_value: propLoanVal,
        },
        {
          where: { property_value_asatdate: today, property_id: propID },
        }
      );
    }
    // update the parent record to reflect the latest value (for querying ease)
    await Properties.update(
      {
        property_valuation: propVal,
        property_loan_value: propLoanVal,
      },
      {
        where: { property_id: propID },
      }
    );
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getCashAccountDataFromDB(reslocalsuser: string) {
  try {
    const usersCashAccounts = await User.findOne({
      attributes: ["users_id"],
      where: {
        users_id: reslocalsuser,
      },
      include: {
        model: CashAccount,
        where: {
          soft_deleted: 0,
        },
      },
    });

    // returns an array of accounts owned by the current user
    return usersCashAccounts;
  } catch (err) {
    return err;
  }
}
