import { DataTypes } from "sequelize";
import { sequelize } from "../modules/database_connect";

module.exports = () => {
  const InvestmentPriceHistory = sequelize.define(
    "investment_price_history",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      holding_market_identifier: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 35],
            msg: "Market indentifier must be between 3 and 20 characters in length.",
          },
        },
      },
      holding_current_price: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0, 225],
            msg: "Market indentifier must be between 3 and 255 characters in length.",
          },
        },
      },
      price_asatdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            args: true,
            msg: "As At Date must be a date format",
          },
        },
      },
    },
    {
      indexes: [
        {
          fields: ["holding_market_identifier"],
        },
      ],
      timestamps: false,
    }
  );

  return InvestmentPriceHistory;
};
