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
      exchangeCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0 - 10],
            msg: "Code must be shorter than 10 characters in length.",
          },
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return stockMarkets;
};
