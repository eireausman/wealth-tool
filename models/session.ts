import { DataTypes } from "sequelize/types";
import { sequelize } from "../modules/database_connect";

module.exports = () => {
  const User = sequelize.define(
    "users",
    {
      users_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      users_username: {
        type: DataTypes.STRING,
        unique: true,

        allowNull: false,
        validate: {
          len: {
            args: [3, 35],
            msg: "Username must be between 3 and 35 characters.",
          },
        },
      },
      users_password: {
        type: DataTypes.STRING,
        allowNull: false,
        len: {
          args: [8, 256],
          msg: "Password must be at least 8 charcters long.",
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return User;
};
