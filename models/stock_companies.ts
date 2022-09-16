import { DataTypes } from "sequelize";
import { sequelize } from "../modules/database_connect";

module.exports = () => {
  const stockCompanies = sequelize.define(
    "stock_companies",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
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
      company_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0 - 10],
            msg: "Symbol must be shorter than 10 characters in length.",
          },
        },
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0 - 10],
            msg: "Company name must be shorter than 225 characters in length",
          },
        },
      },
      industry_or_category: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0 - 225],
            msg: "Industry must be shorter than 225 characters in length.",
          },
        },
      },
      entry_dateupdated: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            args: true,
            msg: "Updated date must be a date",
          },
        },
      },
    },
    {
      indexes: [
        {
          fields: ["exchange_code"],
        },
      ],
      timestamps: false,
    }
  );

  return stockCompanies;
};
