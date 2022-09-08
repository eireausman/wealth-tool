import { DataTypes } from "sequelize";
import { sequelize } from "../modules/database_connect";

module.exports = () => {
  const Properties = sequelize.define(
    "properties",
    {
      property_id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      userUsersId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      property_nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 35],
            msg: "Property name must be between 3 and 20 characters in length.",
          },
        },
      },
      property_owner_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 20],
            msg: "Owner name must be between 3 and 20 characters in length.",
          },
        },
      },
      property_valuation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "Balance must be a number (integer).",
          },
        },
      },
      property_loan_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "Loan amount must be a number (integer).",
          },
        },
      },
      property_valuation_currency: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 3],
            msg: "Currency value must be 3 characters long.",
          },
        },
      },
      property_valuation_curr_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 1],
            msg: "Currency value must be 1 character long.",
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

  return Properties;
};
