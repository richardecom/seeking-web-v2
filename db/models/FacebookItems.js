import { DataTypes } from "sequelize";
import sequelize from "../dbconn";

const FacebookItems = sequelize.define("facebook_items", {
      fb_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      item_id: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.INTEGER
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
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },  
    }, {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
      });
  
  export default FacebookItems
