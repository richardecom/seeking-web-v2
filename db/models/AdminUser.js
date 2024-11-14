import { DataTypes } from "sequelize";
import sequelize from "../dbconn";

const AdminUser = sequelize.define("admin_users", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      email_address: {
        defaultValue: null,
        allowNull: true,
        field: 'email',
        type: DataTypes.STRING(100)
      },
      password: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      address: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      dob: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      image: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.STRING(100)
      },
      user_role: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.TINYINT(1),
        defaultValue: 1
      },  
      status: {
        defaultValue: null,
        allowNull: true,
        type: DataTypes.TINYINT(1),
        defaultValue: 1
      },    
      created_at: {
        defaultValue: DataTypes.NOW,
        type: DataTypes.DATE,
        allowNull: true,
      }, 
      updated_at: {
        defaultValue: DataTypes.NOW,
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
      freezeTableName: true,
      createdAt: false,
      updatedAt: false,
    });

export default AdminUser
