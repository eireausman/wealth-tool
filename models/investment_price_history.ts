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
      holding_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },

      holding_current_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "Price must be a number (integer I.e. 152p or 152c).",
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
      timestamps: false,
    }
  );

  return InvestmentPriceHistory;
};
