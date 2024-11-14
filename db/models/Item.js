import { DataTypes } from "sequelize";
import sequelize from "../dbconn";

const Item = sequelize.define("items", {
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      item_uid: {
        defaultValue: "randomid",
        allowNull: false,
        type: DataTypes.STRING(100)
      },
      item_name: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      image: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      image_url: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(150)
      },
  
      description: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      quantity: {
        allowNull: true,
        type: DataTypes.INTEGER(11),
        defaultValue: 0
      },
      rating: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.INTEGER(11),
      },
      expiry_date: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(111),
      },
      perishable: {
        allowNull: true,
        type: DataTypes.INTEGER(11),
        defaultValue: 0
      },
      always_stock: {
        allowNull: true,
        type: DataTypes.INTEGER(11),
        defaultValue: 0
      },
      uncountable: {
        allowNull: true,
        type: DataTypes.INTEGER(11),
        defaultValue: 0
      },
      favorite: {
        allowNull: true,
        type: DataTypes.INTEGER(11),
        defaultValue: 0
      },
      location_id: {
        allowNull: true,
        type: DataTypes.INTEGER(11),
        defaultValue: null
      },
  
      user_id: {
        allowNull: true,
        type: DataTypes.INTEGER(11),
        defaultValue: null
      },
      category_id: {
        allowNull: true,
        type: DataTypes.INTEGER(11),
        defaultValue: null
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
      is_selling: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.INTEGER(11),
        defaultValue: 0
      },  
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
});

export default Item;
