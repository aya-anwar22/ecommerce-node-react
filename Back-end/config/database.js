const { Sequelize } = require("sequelize");
require("dotenv").config({ path: '.env' }); 
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port:  15736,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
    
  }
);

module.exports = sequelize;