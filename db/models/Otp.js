import { DataTypes } from "sequelize";
import sequelize from "../dbconn";

const Otp = sequelize.define(
  "otp",
  {
    otp_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      defaultValue: null,
      allowNull: true,
      type: DataTypes.STRING(100),
    },
    otp: {
      defaultValue: null,
      allowNull: true,
      type: DataTypes.STRING(11),
    },
    status: {
      defaultValue: null,
      allowNull: true,
      type: DataTypes.INTEGER(11),
      defaultValue: 1,
    },
    type: {
      defaultValue: null,
      allowNull: true,
      type: DataTypes.INTEGER(11),
      defaultValue: 1,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

export default Otp;
