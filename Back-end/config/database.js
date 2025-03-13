const wkx = require("wkx");
try {
  require.resolve("wkx");
  console.log("✅ wkx موجود ويمكن تحميله");
} catch (e) {
  console.error("❌ wkx غير موجود، هناك مشكلة في التثبيت");
}

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mariadb",
    port: process.env.DB_PORT || 3306,
  }
);

module.exports = sequelize;
