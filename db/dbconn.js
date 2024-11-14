import { Sequelize } from "sequelize";

const DB_HOST     = process.env.DB_HOST
const DB_USER     = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME     = process.env.DB_NAME

const sequelize = new Sequelize({
    host: "seeking-db.c9a2gk6agedx.ap-southeast-1.rds.amazonaws.com",
    username: "root",
    password: "Yeswecan123!!",
    database: "seeking_db",
    dialect: "mysql",
    dialectModule: require("mysql2"),
    benchmark: true
});
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection Established")
        await sequelize.sync({ alter: true })
    } catch (error) {
        console.log("Unable to connect to the database")
    }
})();
export default sequelize;
