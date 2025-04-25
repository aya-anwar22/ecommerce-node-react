const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const { Category, SubCategory } = require("./categories_brands");

const Service = sequelize.define("Service", {
    serviceId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    serviceName: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estimatedDuration: { type: DataTypes.STRING },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Categories", key: "categoryId" },
        onDelete: "CASCADE"
    }
}, { timestamps: true });



const ServiceSubCategory = sequelize.define("ServiceSubCategory", {
    serviceSubCategoryId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    serviceId: {
        type: DataTypes.INTEGER,
        references: { model: "Services", key: "serviceId" },
        onDelete: "CASCADE"
    },
    subCategoryId: {
        type: DataTypes.INTEGER,
        references: { model: "subCategories", key: "subCategoryId" },
        onDelete: "CASCADE"
    }
}, { timestamps: true });

module.exports = { Service, ServiceSubCategory };
