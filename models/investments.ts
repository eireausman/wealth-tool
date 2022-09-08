import { DataTypes } from "sequelize";
import { sequelize } from "../modules/database_connect";

module.exports = () => {
  const Investments = sequelize.define(
    "investments",
    {
      holding_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      userUsersId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      holding_owner_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 20],
            msg: "Owner name must be between 3 and 20 characters in length.",
          },
        },
      },
      holding_stock_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 40],
            msg: "Stock name must be between 3 and 40 characters in length.",
          },
        },
      },
      holding_institution: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 35],
            msg: "Instituation must be between 3 and 35 characters in length.",
          },
        },
      },
      holding_market_identifier: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 35],
            msg: "ID must be between 3 and 20 characters in length.",
          },
        },
      },
      holding_currency_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 3],
            msg: "Currency value must be 3 characters long.",
          },
        },
      },
      holding_currency_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 1],
            msg: "Currency symbol value must be 1 character long.",
          },
        },
      },
      holding_quantity_held: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      holding_cost_total_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      soft_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      virtual_BaseCurrencyValue: {
        type: DataTypes.VIRTUAL,
        get() {
          return (
            `${this.holding_quantity_held}` * `${this.holding_current_price}`
          );
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

  return Investments;
};
