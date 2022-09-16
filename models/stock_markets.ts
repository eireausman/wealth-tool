import { DataTypes } from "sequelize";
import { sequelize } from "../modules/database_connect";

module.exports = () => {
  const stockMarkets = sequelize.define(
    "stock_markets",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      exchange_name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0 - 225],
            msg: "Code must be shorter than 225 characters in length.",
          },
        },
      },
      exchange_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0 - 10],
            msg: "Code must be shorter than 10 characters in length.",
          },
        },
      },
      exchange_currency_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0 - 3],
            msg: "Code must be shorter than 3 characters in length.",
          },
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["exchange_code"],
        },
      ],
      timestamps: false,
    }
  );

  return stockMarkets;
};
