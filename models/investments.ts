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
      holding_quantity_held: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

  return Investments;
};
