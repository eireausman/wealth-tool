import { DataTypes } from "sequelize";
import { sequelize } from "../modules/database_connect";
sequelize;

module.exports = () => {
  const CashAccount = sequelize.define(
    "cash_accounts",
    {
      account_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      userUsersId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      account_nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 35],
            msg: "Nickname must be between 3 and 20 characters in length.",
          },
        },
      },
      account_number_last4_digits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "Last 4 account digits must be a number (integer).",
          },
          len: {
            args: [3, 35],
            msg: "Account number account digits must at least 3 characters long",
          },
        },
      },
      account_owner_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 20],
            msg: "Owner name must be between 3 and 20 characters in length.",
          },
        },
      },
      account_balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "Balance must be a number (integer).",
          },
        },
      },
      account_currency_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 3],
            msg: "Currency value must be 3 characters long.",
          },
        },
      },
      account_currency_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 1],
            msg: "Currency symbol value must be 1 character long.",
          },
        },
      },
      soft_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return CashAccount;
};
