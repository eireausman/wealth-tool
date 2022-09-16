import { DataTypes } from "sequelize";
import { sequelize } from "../modules/database_connect";

module.exports = () => {
  const CurrencyCode = sequelize.define(
    "currencies_codes",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
      },
      currency_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3 - 35],
            msg: "Code must be between 3 and 35 characters in length.",
          },
        },
      },
      currency_code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
          len: {
            args: [3],
            msg: "Code must be 3 characters in length.",
          },
        },
      },
      currency_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1],
            msg: "Symbol must be 3 characters in length.",
          },
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return CurrencyCode;
};
