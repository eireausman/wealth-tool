// const { Sequelize, Op, Model, DataTypes } = require("sequelize");

import { DataTypes } from "sequelize";
import { sequelize } from "../modules/database_connect";
const { formatRelative, parseISO } = require("date-fns");
const enGB = require("date-fns/locale/en-GB");

// https://date-fns.org/docs/I18n-Contribution-Guide#formatrelative
// https://github.com/date-fns/date-fns/blob/master/src/locale/en-US/_lib/formatRelative/index.js
// https://github.com/date-fns/date-fns/issues/1218
// https://stackoverflow.com/questions/47244216/how-to-customize-date-fnss-formatrelative

const formatRelativeLocale = {
  lastWeek: "'Last' eeee",
  yesterday: "'Yesterday'",
  today: "'Today'",
  tomorrow: "'Tomorrow'",
  nextWeek: "'Next' eeee",
  other: "dd.MM.yyyy",
};

const locale = {
  ...enGB,
  formatRelative: (token: string) => formatRelativeLocale[token],
};

module.exports = () => {
  const Currency = sequelize.define(
    "currencies_fx",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      currency_code_from: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3],
            msg: "Code must be 3 characters in length.",
          },
        },
      },

      currency_code_to: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3],
            msg: "Code must be 3 characters in length.",
          },
        },
      },

      currency_fxrate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: {
            args: true,
            msg: "FX Rate must be a date",
          },
        },
      },
      currency_fxrate_dateupdated: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            args: true,
            msg: "Updated date must be a date",
          },
        },
      },
      virtual_lastUpdatedDay: {
        type: DataTypes.VIRTUAL,
        get() {
          const dateDayRepresentation: string = formatRelative(
            parseISO(this.currency_fxrate_dateupdated),
            new Date(),
            { locale }
          );
          return `${dateDayRepresentation.toLocaleLowerCase()}`;
        },
        set(value: any) {
          throw new Error("Do not try to set the virtual value!");
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return Currency;
};
