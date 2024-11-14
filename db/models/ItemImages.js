import { DataTypes } from "sequelize";
import sequelize from "../dbconn";

const ItemImages = sequelize.define("item_images", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    item_uid: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
    item_image_url: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(11)
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

export default ItemImages;
