import { DataTypes } from "sequelize";
import sequelize from "../dbconn";

const Category = sequelize.define("categories", {
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      category_name: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100), 
      },
      category_icon: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      category_description: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      category_type: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.INTEGER(11)
      },
      status: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.INTEGER(11),
        defaultValue: 1
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    }, {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
      });
  
  export default Category
  