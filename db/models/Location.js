import { DataTypes } from "sequelize";
import sequelize from "../dbconn";

const Location = sequelize.define("locations", {
    location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }, 
    location_uid: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: null,
    },
    building: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: null,
    },
    room: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: null,
    },
    storage_location: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: null,
    },
    location_description: { 
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    }, 
    location_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    }, 
    location_image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },      
    user_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
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

export default Location;
