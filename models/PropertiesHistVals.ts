// const { Sequelize, Op, Model, DataTypes } = require("sequelize");
import { DataTypes } from "sequelize";
import { sequelize } from "../modules/database_connect";

module.exports = () => {
  const Properties = sequelize.define(
    "properties_historic_values",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      property_valuation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "Value must be a number (integer).",
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
      property_value_asatdate: {
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

  return Properties;
};
