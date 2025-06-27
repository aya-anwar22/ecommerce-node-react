// const { Sequelize } = require("sequelize");
// require("dotenv").config({ path: './.env' });
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "mysql",
//     port: process.env.DB_PORT || 15736,
//     dialectOptions: {},
//   }
// );

// module.exports = sequelize;
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "postgres", // استخدمي postgres
    logging: false,
  }
);

module.exports = sequelize;
